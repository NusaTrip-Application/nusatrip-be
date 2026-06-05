import { ListObjectsV2Command, DeleteObjectsCommand } from "@aws-sdk/client-s3";
import { r2Client, R2_BUCKET_NAME } from "../config/r2";

const FOLDERS_TO_CLEANUP = ["location", "place", "user", "itinerary"];

interface CleanupResult {
	folder: string;
	deletedCount: number;
	failedCount: number;
}

const cleanupExpiredTempFiles = async (): Promise<CleanupResult[]> => {
	const results: CleanupResult[] = [];
	const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);

	console.log("[Media Cleanup] Starting cleanup...");
	console.log(`[Media Cleanup] Cutoff time: ${cutoff.toISOString()}`);

	for (const folder of FOLDERS_TO_CLEANUP) {
		const prefix = `temp/${folder}/`;

		const response = await r2Client.send(
			new ListObjectsV2Command({
				Bucket: R2_BUCKET_NAME,
				Prefix: prefix,
			}),
		);

		const objectsToDelete = (response.Contents ?? []).filter(
			(obj) => obj.LastModified && obj.LastModified < cutoff,
		);

		if (objectsToDelete.length === 0) {
			console.log(`[Media Cleanup] No expired files in ${folder}`);
			results.push({ folder, deletedCount: 0, failedCount: 0 });
			continue;
		}

		console.log(
			`[Media Cleanup] Found ${objectsToDelete.length} expired files in ${folder}`,
		);

		try {
			await r2Client.send(
				new DeleteObjectsCommand({
					Bucket: R2_BUCKET_NAME,
					Delete: {
						Objects: objectsToDelete.map((obj) => ({ Key: obj.Key! })),
						Quiet: true,
					},
				}),
			);

			console.log(
				`[Media Cleanup] Deleted ${objectsToDelete.length} files from ${folder}`,
			);
			results.push({
				folder,
				deletedCount: objectsToDelete.length,
				failedCount: 0,
			});
		} catch (error) {
			console.error(
				`[Media Cleanup] Failed to delete files in ${folder}:`,
				error,
			);
			results.push({
				folder,
				deletedCount: 0,
				failedCount: objectsToDelete.length,
			});
		}
	}

	const totalDeleted = results.reduce((sum, r) => sum + r.deletedCount, 0);
	console.log(`[Media Cleanup] Completed. Total deleted: ${totalDeleted}`);

	return results;
};

export { cleanupExpiredTempFiles };
export default cleanupExpiredTempFiles;