import { NextFunction, Request, Response } from "express";
import { successResponse } from "../utils/response";
import {
	adminGetItinerariesQuerySchema,
	createItineraryItemSchema,
	createItinerarySchema,
	getItineraryByIdParamsSchema,
	getItineraryItemParamsSchema,
	getMyItinerariesQuerySchema,
	updateBudgetSchema,
	updateItineraryItemSchema,
	updateItinerarySchema,
} from "../validations/itineraryValidation";
import ItineraryService from "../services/itineraryService";
import type { ValidationRequest } from "../types/authType";
import { AppError } from "../middlewares/errorHandler";

class ItineraryController {
	private static requireAuthenticatedUser(req: ValidationRequest) {
		if (!req.user) {
			throw new AppError("Unauthorized", 401);
		}

		return req.user;
	}

	static async createItinerary(
		req: ValidationRequest,
		res: Response,
		next: NextFunction,
	) {
		try {
			const validatedData = createItinerarySchema.parse(req.body);
			const user = ItineraryController.requireAuthenticatedUser(req);
			const result = await ItineraryService.createItinerary(user.id, validatedData);

			return successResponse(res, result, "Itinerary created successfully", 201);
		} catch (error) {
			next(error);
		}
	}

	static async updateItinerary(
		req: ValidationRequest,
		res: Response,
		next: NextFunction,
	) {
		try {
			const user = ItineraryController.requireAuthenticatedUser(req);
			const { itineraryId } = getItineraryByIdParamsSchema.parse(req.params);
			const validatedData = updateItinerarySchema.parse(req.body);
			const result = await ItineraryService.updateItinerary(
				user,
				itineraryId,
				validatedData,
			);

			return successResponse(res, result, "Itinerary updated successfully");
		} catch (error) {
			next(error);
		}
	}

	static async deleteItinerary(
		req: ValidationRequest,
		res: Response,
		next: NextFunction,
	) {
		try {
			const user = ItineraryController.requireAuthenticatedUser(req);
			const { itineraryId } = getItineraryByIdParamsSchema.parse(req.params);
			const result = await ItineraryService.deleteItinerary(user, itineraryId);

			return successResponse(res, result, "Itinerary deleted successfully");
		} catch (error) {
			next(error);
		}
	}

	static async createItineraryItem(
		req: ValidationRequest,
		res: Response,
		next: NextFunction,
	) {
		try {
			const user = ItineraryController.requireAuthenticatedUser(req);
			const { itineraryId } = getItineraryByIdParamsSchema.parse(req.params);
			const validatedData = createItineraryItemSchema.parse(req.body);
			const result = await ItineraryService.createItineraryItem(
				user,
				itineraryId,
				validatedData,
			);

			return successResponse(
				res,
				result,
				"Itinerary item created successfully",
				201,
			);
		} catch (error) {
			next(error);
		}
	}

	static async updateItineraryItem(
		req: ValidationRequest,
		res: Response,
		next: NextFunction,
	) {
		try {
			const user = ItineraryController.requireAuthenticatedUser(req);
			const { itineraryId, itineraryItemId } =
				getItineraryItemParamsSchema.parse(req.params);
			const validatedData = updateItineraryItemSchema.parse(req.body);
			const result = await ItineraryService.updateItineraryItem(
				user,
				itineraryId,
				itineraryItemId,
				validatedData,
			);

			return successResponse(res, result, "Itinerary item updated successfully");
		} catch (error) {
			next(error);
		}
	}

	static async deleteItineraryItem(
		req: ValidationRequest,
		res: Response,
		next: NextFunction,
	) {
		try {
			const user = ItineraryController.requireAuthenticatedUser(req);
			const { itineraryId, itineraryItemId } =
				getItineraryItemParamsSchema.parse(req.params);
			const result = await ItineraryService.deleteItineraryItem(
				user,
				itineraryId,
				itineraryItemId,
			);

			return successResponse(res, result, "Itinerary item deleted successfully");
		} catch (error) {
			next(error);
		}
	}

	static async getMyItineraries(
		req: ValidationRequest,
		res: Response,
		next: NextFunction,
	) {
		try {
			const validatedQuery = getMyItinerariesQuerySchema.parse(req.query);
			const user = ItineraryController.requireAuthenticatedUser(req);
			const result = await ItineraryService.getMyItineraries(user.id, validatedQuery);

			return successResponse(res, result, "My itineraries fetched successfully");
		} catch (error) {
			next(error);
		}
	}

	static async getItineraryDetail(
		req: ValidationRequest,
		res: Response,
		next: NextFunction,
	) {
		try {
			const user = ItineraryController.requireAuthenticatedUser(req);
			const { itineraryId } = getItineraryByIdParamsSchema.parse(req.params);
			const result = await ItineraryService.getItineraryDetail(user, itineraryId);

			return successResponse(res, result, "Itinerary detail fetched successfully");
		} catch (error) {
			next(error);
		}
	}

	static async updateEstimatedTotalBudget(
		req: Request,
		res: Response,
		next: NextFunction,
	) {
		try {
			const user = ItineraryController.requireAuthenticatedUser(req as ValidationRequest);
			const { itineraryId } = getItineraryByIdParamsSchema.parse(req.params);
			const validatedData = updateBudgetSchema.parse(req.body);
			const result = await ItineraryService.updateEstimatedTotalBudget(
				user,
				itineraryId,
				validatedData,
			);

			return successResponse(res, result, "Itinerary budget updated successfully");
		} catch (error) {
			next(error);
		}
	}

	static async getAdminItineraries(req: Request, res: Response, next: NextFunction) {
		try {
			const validatedQuery = adminGetItinerariesQuerySchema.parse(req.query);
			const result = await ItineraryService.getAdminItineraries(validatedQuery);

			return successResponse(res, result, "Itineraries fetched successfully");
		} catch (error) {
			next(error);
		}
	}

	static async getItinerarySummary(
		_req: Request,
		res: Response,
		next: NextFunction,
	) {
		try {
			const result = await ItineraryService.getItinerarySummary();

			return successResponse(res, result, "Itinerary summary fetched successfully");
		} catch (error) {
			next(error);
		}
	}
}

export default ItineraryController;
