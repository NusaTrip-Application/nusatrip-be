import { NextFunction, Request, Response } from "express";
import { successResponse } from "../utils/response";
import MediaService from "../services/mediaService";
import { AppError } from "../middlewares/errorHandler";
import type { ValidationRequest } from "../types/authType";
import {
	createPresignedUrlSchema,
	deleteMediaSchema,
} from "../validations/mediaValidation";

class MediaController {
	private static requireAuthenticatedUser(req: ValidationRequest) {
		if (!req.user) {
			throw new AppError("Unauthorized", 401);
		}

		return req.user;
	}

	static async generatePresignedUrl(
		req: ValidationRequest,
		res: Response,
		next: NextFunction,
	) {
		try {
			const user = MediaController.requireAuthenticatedUser(req);
			const validatedData = createPresignedUrlSchema.parse(req.body);
			const result = await MediaService.generatePresignedUrl({
				...validatedData,
				userId: user.id,
			});

			return successResponse(res, result, "Presigned URL generated");
		} catch (error) {
			next(error);
		}
	}

	static async deleteFile(
		req: Request,
		res: Response,
		next: NextFunction,
	) {
		try {
			const { fileKey } = deleteMediaSchema.parse(req.body);

			await MediaService.deleteFile(fileKey);
			return successResponse(res, null, "File deleted");
		} catch (error) {
			next(error);
		}
	}
}

export default MediaController;
