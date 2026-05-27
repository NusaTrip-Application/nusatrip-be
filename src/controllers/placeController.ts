import { NextFunction, Request, Response } from "express";
import {
	adminGetPlacesQuerySchema,
	createPlaceSchema,
	getPlaceByIdParamsSchema,
	getPlaceRecommendationsQuerySchema,
	updatePlaceSchema,
} from "../validations/placeValidation";
import { successResponse } from "../utils/response";
import PlaceService from "../services/placeService";

class PlaceController {
	static async getPlaceCategories(
		req: Request,
		res: Response,
		next: NextFunction,
	) {
		try {
			const result = await PlaceService.getPlaceCategories();

			return successResponse(res, result, "Categories fetched successfully");
		} catch (error) {
			next(error);
		}
	}

	static async createPlace(req: Request, res: Response, next: NextFunction) {
		try {
			const validatedData = createPlaceSchema.parse(req.body);
			const result = await PlaceService.createPlace(validatedData);

			return successResponse(res, result, "Place created successfully", 201);
		} catch (error) {
			next(error);
		}
	}

	static async updatePlace(req: Request, res: Response, next: NextFunction) {
		try {
			const { placeId } = getPlaceByIdParamsSchema.parse(req.params);
			const validatedData = updatePlaceSchema.parse(req.body);
			const result = await PlaceService.updatePlace(placeId, validatedData);

			return successResponse(res, result, "Place updated successfully");
		} catch (error) {
			next(error);
		}
	}

	static async deletePlace(req: Request, res: Response, next: NextFunction) {
		try {
			const { placeId } = getPlaceByIdParamsSchema.parse(req.params);
			const result = await PlaceService.deletePlace(placeId);

			return successResponse(res, result, "Place deleted successfully");
		} catch (error) {
			next(error);
		}
	}

	static async getAdminPlaces(req: Request, res: Response, next: NextFunction) {
		try {
			const validatedQuery = adminGetPlacesQuerySchema.parse(req.query);
			const result = await PlaceService.getAdminPlaces(validatedQuery);

			return successResponse(res, result, "Places fetched successfully");
		} catch (error) {
			next(error);
		}
	}

	static async getAdminPlaceById(
		req: Request,
		res: Response,
		next: NextFunction,
	) {
		try {
			const { placeId } = getPlaceByIdParamsSchema.parse(req.params);
			const result = await PlaceService.getPlaceById(placeId);

			return successResponse(res, result, "Place fetched successfully");
		} catch (error) {
			next(error);
		}
	}

	static async getPublicPlaceById(
		req: Request,
		res: Response,
		next: NextFunction,
	) {
		try {
			const { placeId } = getPlaceByIdParamsSchema.parse(req.params);
			const result = await PlaceService.getActivePlaceById(placeId);

			return successResponse(res, result, "Place fetched successfully");
		} catch (error) {
			next(error);
		}
	}

	static async getPlaceRecommendations(
		req: Request,
		res: Response,
		next: NextFunction,
	) {
		try {
			const validatedQuery = getPlaceRecommendationsQuerySchema.parse(
				req.query,
			);
			const result = await PlaceService.getPlaceRecommendations(validatedQuery);

			return successResponse(
				res,
				result,
				"Place recommendations fetched successfully",
			);
		} catch (error) {
			next(error);
		}
	}

	static async getPlaceSummary(
		_req: Request,
		res: Response,
		next: NextFunction,
	) {
		try {
			const result = await PlaceService.getPlaceSummary();

			return successResponse(res, result, "Place summary fetched successfully");
		} catch (error) {
			next(error);
		}
	}
}

export default PlaceController;
