import { Request, Response, NextFunction } from "express";
import DashboardService from "../services/dashboardService";
import { successResponse } from "../utils/response";

class DashboardController {
	static async getDashboard(
		_req: Request,
		res: Response,
		next: NextFunction,
	) {
		try {
			const result = await DashboardService.getDashboardData();

			return successResponse(res, result, "Dashboard data fetched successfully");
		} catch (error) {
			next(error);
		}
	}
}

export default DashboardController;