import { ListObjectsV2Command, DeleteObjectsCommand } from "@aws-sdk/client-s3";
import { r2Client, R2_BUCKET_NAME } from "../config/r2";
import cron from "node-cron";

const cleanupTempFiles = async () => {
	console.log("[Cleanup] Running temp file cleanup...");

	const response = await r2Client.send(
		new ListObjectsV2Command({
			Bucket: R2_BUCKET_NAME,
			Prefix: "temp/product-images/",
		}),
	);

	const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);

	const toDelete = (response.Contents ?? []).filter(
		(obj) => obj.LastModified && obj.LastModified < cutoff,
	);

	if (toDelete.length === 0) {
		console.log("[Cleanup] No temp files to delete");
		return;
	}

	await r2Client.send(
		new DeleteObjectsCommand({
			Bucket: R2_BUCKET_NAME,
			Delete: {
				Objects: toDelete.map((obj) => ({ Key: obj.Key! })),
			},
		}),
	);

	console.log(`[Cleanup] Deleted ${toDelete.length} temp files`);
};

cron.schedule("0 */6 * * *", cleanupTempFiles);

export default cleanupTempFiles;
