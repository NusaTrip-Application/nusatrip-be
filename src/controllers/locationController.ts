import { NextFunction, Request, Response } from "express";
import type { ValidationRequest } from "../types/authType";
import {
	adminGetLocationsQuerySchema,
	changeLocationStatusSchema,
	createLocationSchema,
	getLocationByIdParamsSchema,
	publicGetLocationsQuerySchema,
	updateLocationSchema,
} from "../validations/locationValidation";
import { successResponse } from "../utils/response";
import LocationService from "../services/locationService";

class LocationController {
	static async getProvinces(
		_req: Request,
		res: Response,
		next: NextFunction,
	) {
		try {
			const result = await LocationService.getActiveProvinces();

			return successResponse(res, result, "Provinces fetched successfully");
		} catch (error) {
			next(error);
		}
	}

	static async getLocationOptions(
		_req: Request,
		res: Response,
		next: NextFunction,
	) {
		try {
			const result = await LocationService.getActiveLocationOptions();

			return successResponse(res, result, "Locations fetched successfully");
		} catch (error) {
			next(error);
		}
	}

	static async publicGetLocations(
		req: Request,
		res: Response,
		next: NextFunction,
	) {
		try {
			const validatedQuery = publicGetLocationsQuerySchema.parse(req.query);
			const result = await LocationService.getPublicLocations(validatedQuery);

			return successResponse(res, result, "Locations fetched successfully");
		} catch (error) {
			next(error);
		}
	}

	static async adminGetLocations(
		req: Request,
		res: Response,
		next: NextFunction,
	) {
		try {
			const validatedQuery = adminGetLocationsQuerySchema.parse(req.query);
			const result = await LocationService.getAdminLocations(validatedQuery);

			return successResponse(res, result, "Locations fetched successfully");
		} catch (error) {
			next(error);
		}
	}

	static async publicGetLocationById(
		req: Request,
		res: Response,
		next: NextFunction,
	) {
		try {
			const { locationId } = getLocationByIdParamsSchema.parse(req.params);
			const result = await LocationService.getActiveLocationById(locationId);

			return successResponse(res, result, "Location fetched successfully");
		} catch (error) {
			next(error);
		}
	}

	static async getLocationById(
		req: Request,
		res: Response,
		next: NextFunction,
	) {
		try {
			const { locationId } = getLocationByIdParamsSchema.parse(req.params);
			const result = await LocationService.getLocationById(locationId);

			return successResponse(res, result, "Location fetched successfully");
		} catch (error) {
			next(error);
		}
	}

	static async createLocation(
		req: ValidationRequest,
		res: Response,
		next: NextFunction,
	) {
		try {
			const validatedData = createLocationSchema.parse(req.body);
			const result = await LocationService.createLocation(req.user!.id, validatedData);

			return successResponse(res, result, "Location created successfully", 201);
		} catch (error) {
			next(error);
		}
	}

	static async updateLocation(
		req: ValidationRequest,
		res: Response,
		next: NextFunction,
	) {
		try {
			const { locationId } = getLocationByIdParamsSchema.parse(req.params);
			const validatedData = updateLocationSchema.parse(req.body);
			const result = await LocationService.updateLocation(req.user!.id, locationId, validatedData);

			return successResponse(res, result, "Location updated successfully");
		} catch (error) {
			next(error);
		}
	}

	static async deleteLocation(
		req: Request,
		res: Response,
		next: NextFunction,
	) {
		try {
			const { locationId } = getLocationByIdParamsSchema.parse(req.params);
			const result = await LocationService.deleteLocation(locationId);

			return successResponse(res, result, "Location deleted successfully");
		} catch (error) {
			next(error);
		}
	}

	static async changeLocationStatus(
		req: Request,
		res: Response,
		next: NextFunction,
	) {
		try {
			const { locationId } = getLocationByIdParamsSchema.parse(req.params);
			const validatedData = changeLocationStatusSchema.parse(req.body);
			const result = await LocationService.changeLocationStatus(
				locationId,
				validatedData,
			);

			return successResponse(
				res,
				result,
				"Location status updated successfully",
			);
		} catch (error) {
			next(error);
		}
	}

	static async getLocationSummary(
		_req: Request,
		res: Response,
		next: NextFunction,
	) {
		try {
			const result = await LocationService.getLocationSummary();

			return successResponse(
				res,
				result,
				"Location summary fetched successfully",
			);
		} catch (error) {
			next(error);
		}
	}
}

export default LocationController;
