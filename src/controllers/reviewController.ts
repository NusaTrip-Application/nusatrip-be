import { NextFunction, Request, Response } from "express";
import { AppError } from "../middlewares/errorHandler";
import ReviewService from "../services/reviewService";
import type { ValidationRequest } from "../types/authType";
import { successResponse } from "../utils/response";
import {
	adminGetReviewsQuerySchema,
	createReviewSchema,
	getReviewByIdParamsSchema,
	getReviewByItineraryParamsSchema,
	publicGetReviewsQuerySchema,
	updateReviewSchema,
} from "../validations/reviewValidation";

class ReviewController {
	private static requireAuthenticatedUser(req: ValidationRequest) {
		if (!req.user) {
			throw new AppError("Unauthorized", 401);
		}

		return req.user;
	}

	static async createReview(
		req: ValidationRequest,
		res: Response,
		next: NextFunction,
	) {
		try {
			const user = ReviewController.requireAuthenticatedUser(req);
			const { itineraryId } = getReviewByItineraryParamsSchema.parse(req.params);
			const validatedData = createReviewSchema.parse(req.body);
			const result = await ReviewService.createReview(
				user,
				itineraryId,
				validatedData,
			);

			return successResponse(res, result, "Review created successfully", 201);
		} catch (error) {
			next(error);
		}
	}

	static async updateReview(
		req: ValidationRequest,
		res: Response,
		next: NextFunction,
	) {
		try {
			const user = ReviewController.requireAuthenticatedUser(req);
			const { reviewId } = getReviewByIdParamsSchema.parse(req.params);
			const validatedData = updateReviewSchema.parse(req.body);
			const result = await ReviewService.updateReview(
				user,
				reviewId,
				validatedData,
			);

			return successResponse(res, result, "Review updated successfully");
		} catch (error) {
			next(error);
		}
	}

	static async deleteReview(
		req: ValidationRequest,
		res: Response,
		next: NextFunction,
	) {
		try {
			const user = ReviewController.requireAuthenticatedUser(req);
			const { reviewId } = getReviewByIdParamsSchema.parse(req.params);
			const result = await ReviewService.deleteReview(user, reviewId);

			return successResponse(res, result, "Review deleted successfully");
		} catch (error) {
			next(error);
		}
	}

	static async getPublicReviews(
		req: Request,
		res: Response,
		next: NextFunction,
	) {
		try {
			const validatedQuery = publicGetReviewsQuerySchema.parse(req.query);
			const result = await ReviewService.getPublicReviews(validatedQuery);

			return successResponse(res, result, "Reviews fetched successfully");
		} catch (error) {
			next(error);
		}
	}

	static async getPublicReviewsByItinerary(
		req: Request,
		res: Response,
		next: NextFunction,
	) {
		try {
			const { itineraryId } = getReviewByItineraryParamsSchema.parse(req.params);
			const validatedQuery = publicGetReviewsQuerySchema.parse({
				...req.query,
				itineraryId,
			});
			const result = await ReviewService.getPublicReviews(validatedQuery);

			return successResponse(res, result, "Reviews fetched successfully");
		} catch (error) {
			next(error);
		}
	}

	static async getAdminReviews(req: Request, res: Response, next: NextFunction) {
		try {
			const validatedQuery = adminGetReviewsQuerySchema.parse(req.query);
			const result = await ReviewService.getAdminReviews(validatedQuery);

			return successResponse(res, result, "Reviews fetched successfully");
		} catch (error) {
			next(error);
		}
	}

	static async getReviewSummary(
		_req: Request,
		res: Response,
		next: NextFunction,
	) {
		try {
			const result = await ReviewService.getReviewSummary();

			return successResponse(res, result, "Review summary fetched successfully");
		} catch (error) {
			next(error);
		}
	}
}

export default ReviewController;
