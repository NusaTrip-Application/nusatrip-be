import { NextFunction, Request, Response } from "express";
import { successResponse } from "../utils/response";
import CommunityService from "../services/communityService";
import {
	getCommunityItinerariesQuerySchema,
	getOtherAuthorItinerariesQuerySchema,
	getSavedItinerariesQuerySchema,
} from "../validations/communityValidation";
import { getItineraryByIdParamsSchema } from "../validations/itineraryValidation";

class CommunityController {
	static async getCommunityItineraries(
		req: Request,
		res: Response,
		next: NextFunction,
	) {
		try {
			const validatedQuery = getCommunityItinerariesQuerySchema.parse(req.query);
			const result =
				await CommunityService.getCommunityItineraries(validatedQuery);

			return successResponse(res, result, "Community itineraries fetched");
		} catch (error) {
			next(error);
		}
	}

	static async getCommunitySummary(
		req: Request,
		res: Response,
		next: NextFunction,
	) {
		try {
			const { itineraryId } = getItineraryByIdParamsSchema.parse(req.params);
			const result = await CommunityService.getCommunitySummary(itineraryId);

			return successResponse(res, result, "Community summary fetched");
		} catch (error) {
			next(error);
		}
	}

	static async saveItinerary(req: Request, res: Response, next: NextFunction) {
		try {
			const { itineraryId } = getItineraryByIdParamsSchema.parse(req.params);
			const user = (req as any).user;
			const result = await CommunityService.saveItinerary(user, itineraryId);

			return successResponse(res, result, "Itinerary saved", 201);
		} catch (error) {
			next(error);
		}
	}

	static async getSavedItineraries(
		req: Request,
		res: Response,
		next: NextFunction,
	) {
		try {
			const validatedQuery = getSavedItinerariesQuerySchema.parse(req.query);
			const user = (req as any).user;
			const result = await CommunityService.getSavedItineraries(
				user,
				validatedQuery,
			);

			return successResponse(res, result, "Saved itineraries fetched");
		} catch (error) {
			next(error);
		}
	}

	static async duplicateItinerary(
		req: Request,
		res: Response,
		next: NextFunction,
	) {
		try {
			const { itineraryId } = getItineraryByIdParamsSchema.parse(req.params);
			const user = (req as any).user;
			const result = await CommunityService.duplicateItinerary(user, itineraryId);

			return successResponse(res, result, "Itinerary duplicated successfully", 201);
		} catch (error) {
			next(error);
		}
	}

	static async getOtherAuthorItineraries(
		req: Request,
		res: Response,
		next: NextFunction,
	) {
		try {
			const { itineraryId } = getItineraryByIdParamsSchema.parse(req.params);
			const validatedQuery = getOtherAuthorItinerariesQuerySchema.parse(req.query);
			const result = await CommunityService.getOtherAuthorItineraries(
				itineraryId,
				validatedQuery,
			);

			return successResponse(res, result, "Other itineraries fetched");
		} catch (error) {
			next(error);
		}
	}
}

export default CommunityController;
