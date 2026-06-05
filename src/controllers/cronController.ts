import { NextFunction, Request, Response } from "express";
import { successResponse } from "../utils/response";
import { cleanupExpiredTempFiles } from "../jobs/mediaCleanup";
import { AppError } from "../middlewares/errorHandler";

class CronController {
	static async mediaCleanup(req: Request, res: Response, next: NextFunction) {
		try {
			const results = await cleanupExpiredTempFiles();

			const totalDeleted = results.reduce(
				(sum, r) => sum + r.deletedCount,
				0,
			);

			return successResponse(
				res,
				{
					totalDeleted,
					details: results,
				},
				"Media cleanup completed",
			);
		} catch (error) {
			console.error("[Cron] Media cleanup failed:", error);
			next(new AppError("Media cleanup failed", 500));
		}
	}
}

export default CronController;