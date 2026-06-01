import {
	PutObjectCommand,
	CopyObjectCommand,
	DeleteObjectCommand,
	HeadObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { r2Client, R2_BUCKET_NAME } from "../config/r2";
import {
	PresignedUrlRequest,
	PresignedUrlResponse,
} from "../types/mediaType";
import { AppError } from "../middlewares/errorHandler";
import { randomUUID } from "crypto";

const ALLOWED_MIME_TYPES = [
	"image/jpeg",
	"image/png",
	"image/webp",
	"image/gif",
];
const MAX_FILE_SIZE = 10 * 1024 * 1024;

class MediaService {
	static async generatePresignedUrl(
		body: PresignedUrlRequest,
	): Promise<PresignedUrlResponse> {
		const { mimetype, size, userId, folder } = body;

		if (!ALLOWED_MIME_TYPES.includes(mimetype)) {
			throw new AppError(`Mime type ${mimetype} is not allowed`, 400);
		}

		if (size > MAX_FILE_SIZE) {
			throw new AppError("File size exceeds 10MB limit", 400);
		}

		const ext = mimetype.split("/")[1];
		const tempKey = `temp/${folder}/${userId}/${randomUUID()}.${ext}`;

		const command = new PutObjectCommand({
			Bucket: R2_BUCKET_NAME,
			Key: tempKey,
			ContentType: mimetype,
			ContentLength: size,
		});

		const url = await getSignedUrl(r2Client, command, { expiresIn: 300 });

		return { url, tempKey };
	}

	static async validateTempKeyExists(tempKey: string): Promise<void> {
		try {
			await r2Client.send(
				new HeadObjectCommand({
					Bucket: R2_BUCKET_NAME,
					Key: tempKey,
				}),
			);
		} catch {
			throw new AppError(`File not found in storage: ${tempKey}`, 400);
		}
	}

	static async validateTempKey(tempKey: string, userId: string, folder: string): Promise<void> {
		const validPrefix = `temp/${folder}/${userId}/`;
		if (!tempKey.startsWith(validPrefix)) {
			throw new AppError(`Invalid temp key: ${tempKey}`, 400);
		}
		await MediaService.validateTempKeyExists(tempKey);
	}

	static async promoteToFinal(
		tempKey: string,
		entityId: string,
		folder: string,
	): Promise<string> {
		const filename = tempKey.split("/").pop();
		const finalKey = `${folder}/${entityId}/${filename}`;

		await r2Client.send(
			new CopyObjectCommand({
				Bucket: R2_BUCKET_NAME,
				CopySource: `${R2_BUCKET_NAME}/${tempKey}`,
				Key: finalKey,
			}),
		);

		return finalKey;
	}

	static async deleteFile(fileKey: string): Promise<void> {
		try {
			await r2Client.send(
				new DeleteObjectCommand({
					Bucket: R2_BUCKET_NAME,
					Key: fileKey,
				}),
			);
		} catch (error) {
			console.error(`Failed to delete R2 object: ${fileKey}`, error);
		}
	}
}

export default MediaService;
