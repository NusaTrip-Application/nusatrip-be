import type { Prisma } from "../../generated/prisma/client";
import { AppError } from "../middlewares/errorHandler";
import ReviewRepository, {
	type ReviewItem,
} from "../repositories/reviewRepository";
import type { UserData } from "../types/authType";
import type {
	AdminGetReviewsQuery,
	CreateReviewPayload,
	PublicGetReviewsQuery,
	UpdateReviewPayload,
} from "../types/reviewType";

class ReviewService {
	static async createReview(
		currentUser: UserData,
		itineraryId: string,
		payload: CreateReviewPayload,
	) {
		const itinerary =
			await ReviewRepository.findPublishedItineraryById(itineraryId);

		if (!itinerary) {
			throw new AppError("Published itinerary not found", 404);
		}

		if (itinerary.userId === currentUser.id) {
			throw new AppError("You cannot review your own itinerary", 400);
		}

		const existingReview =
			await ReviewRepository.findReviewByItineraryAndReviewer(
				itineraryId,
				currentUser.id,
			);

		if (existingReview) {
			throw new AppError("You have already reviewed this itinerary", 409);
		}

		const createPayload: Prisma.PublishedItineraryReviewCreateInput = {
			itinerary: {
				connect: {
					itineraryId,
				},
			},
			reviewerUser: {
				connect: {
					userId: currentUser.id,
				},
			},
			rating: payload.rating,
			...(payload.comment ? { comment: payload.comment } : {}),
		};

		const review = await ReviewRepository.createReview(createPayload);
		return mapReviewItem(review);
	}

	static async updateReview(
		currentUser: UserData,
		reviewId: string,
		payload: UpdateReviewPayload,
	) {
		const review = await getOwnedReview(currentUser.id, reviewId);
		const normalizedPayload = normalizeOptionalStringFields(payload);
		const updatePayload: Prisma.PublishedItineraryReviewUpdateInput = {};

		if (normalizedPayload.rating !== undefined) {
			updatePayload.rating = normalizedPayload.rating;
		}

		if (normalizedPayload.comment !== undefined) {
			updatePayload.comment = normalizedPayload.comment;
		}

		const updatedReview = await ReviewRepository.updateReviewById(
			review.reviewId,
			updatePayload,
		);
		return mapReviewItem(updatedReview);
	}

	static async deleteReview(currentUser: UserData, reviewId: string) {
		const review = await getOwnedReview(currentUser.id, reviewId);
		const deletedReview = await ReviewRepository.deleteReviewById(review.reviewId);

		return mapReviewItem(deletedReview);
	}

	static async getPublicReviews(query: PublicGetReviewsQuery) {
		const { items, totalItems } = await ReviewRepository.findPublicReviews(query);
		const totalPages = Math.max(1, Math.ceil(totalItems / query.limit));

		return {
			items: items.map(mapReviewItem),
			metadata: {
				page: query.page,
				limit: query.limit,
				totalItems,
				totalPages,
				hasNextPage: query.page < totalPages,
				hasPrevPage: query.page > 1,
			},
		};
	}

	static async getAdminReviews(query: AdminGetReviewsQuery) {
		const { items, totalItems } = await ReviewRepository.findAdminReviews(query);
		const totalPages = Math.max(1, Math.ceil(totalItems / query.limit));

		return {
			items: items.map(mapReviewItem),
			metadata: {
				page: query.page,
				limit: query.limit,
				totalItems,
				totalPages,
				hasNextPage: query.page < totalPages,
				hasPrevPage: query.page > 1,
			},
		};
	}

	static async getReviewSummary() {
		const summary = await ReviewRepository.getReviewSummary();

		return {
			...summary,
			averageRating: roundNumber(summary.averageRating),
		};
	}
}

async function getOwnedReview(userId: string, reviewId: string) {
	const review = await ReviewRepository.findReviewById(reviewId);

	if (!review) {
		throw new AppError("Review not found", 404);
	}

	if (review.reviewerUserId !== userId) {
		throw new AppError("Forbidden", 403);
	}

	return review;
}

function normalizeOptionalStringFields<T extends Record<string, unknown>>(
	payload: T,
): T {
	return Object.fromEntries(
		Object.entries(payload).map(([key, value]) => [
			key,
			value === "" ? null : value,
		]),
	) as T;
}

function mapReviewItem(review: ReviewItem) {
	return {
		reviewId: review.reviewId,
		itineraryId: review.itineraryId,
		reviewerUserId: review.reviewerUserId,
		rating: Number(review.rating),
		comment: review.comment,
		isHidden: review.isHidden,
		createdAt: review.createdAt,
		updatedAt: review.updatedAt,
		itinerary: {
			itineraryId: review.itinerary.itineraryId,
			title: review.itinerary.title,
			visibilityStatus: review.itinerary.visibilityStatus,
		},
		reviewer: {
			userId: review.reviewerUser.userId,
			fullName: review.reviewerUser.fullName,
			photoUrl: review.reviewerUser.profilePhotoUrl,
		},
	};
}

function roundNumber(value: number) {
	return Math.round(value * 100) / 100;
}

export default ReviewService;
