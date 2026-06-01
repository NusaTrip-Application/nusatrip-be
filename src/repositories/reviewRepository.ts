import { VisibilityStatus } from "../../generated/prisma/enums";
import { Prisma } from "../../generated/prisma/client";
import { prisma } from "../config/prisma";
import type {
	AdminGetReviewsQuery,
	PublicGetReviewsQuery,
} from "../types/reviewType";

const reviewSelect = {
	reviewId: true,
	itineraryId: true,
	reviewerUserId: true,
	rating: true,
	comment: true,
	isHidden: true,
	createdAt: true,
	updatedAt: true,
	itinerary: {
		select: {
			itineraryId: true,
			title: true,
			visibilityStatus: true,
			userId: true,
		},
	},
	reviewerUser: {
		select: {
			userId: true,
			fullName: true,
			profilePhotoUrl: true,
		},
	},
} as const;

class ReviewRepository {
	static async findPublishedItineraryById(itineraryId: string) {
		return prisma.itinerary.findFirst({
			where: {
				itineraryId,
				visibilityStatus: VisibilityStatus.PUBLISHED,
			},
			select: {
				itineraryId: true,
				userId: true,
			},
		});
	}

	static async findReviewByItineraryAndReviewer(
		itineraryId: string,
		reviewerUserId: string,
	) {
		return prisma.publishedItineraryReview.findUnique({
			where: {
				itineraryId_reviewerUserId: {
					itineraryId,
					reviewerUserId,
				},
			},
			select: reviewSelect,
		});
	}

	static async findReviewById(reviewId: string) {
		return prisma.publishedItineraryReview.findUnique({
			where: { reviewId },
			select: reviewSelect,
		});
	}

	static async createReview(payload: Prisma.PublishedItineraryReviewCreateInput) {
		return prisma.publishedItineraryReview.create({
			data: payload,
			select: reviewSelect,
		});
	}

	static async updateReviewById(
		reviewId: string,
		payload: Prisma.PublishedItineraryReviewUpdateInput,
	) {
		return prisma.publishedItineraryReview.update({
			where: { reviewId },
			data: payload,
			select: reviewSelect,
		});
	}

	static async deleteReviewById(reviewId: string) {
		return prisma.publishedItineraryReview.delete({
			where: { reviewId },
			select: reviewSelect,
		});
	}

	static async findPublicReviews(query: PublicGetReviewsQuery) {
		const where = buildReviewWhereInput(query, {
			isHidden: false,
			publishedOnly: true,
		});
		const orderBy = mapReviewSort(query.sortBy);
		const skip = (query.page - 1) * query.limit;

		const [items, totalItems] = await prisma.$transaction([
			prisma.publishedItineraryReview.findMany({
				where,
				orderBy,
				skip,
				take: query.limit,
				select: reviewSelect,
			}),
			prisma.publishedItineraryReview.count({ where }),
		]);

		return { items, totalItems };
	}

	static async findAdminReviews(query: AdminGetReviewsQuery) {
		const filterOptions =
			query.status === "active"
				? { isHidden: false }
				: query.status === "inactive"
					? { isHidden: true }
					: {};
		const where = buildReviewWhereInput(query, filterOptions);
		const orderBy = mapReviewSort(query.sortBy);
		const skip = (query.page - 1) * query.limit;

		const [items, totalItems] = await prisma.$transaction([
			prisma.publishedItineraryReview.findMany({
				where,
				orderBy,
				skip,
				take: query.limit,
				select: reviewSelect,
			}),
			prisma.publishedItineraryReview.count({ where }),
		]);

		return { items, totalItems };
	}

	static async getReviewSummary() {
		const [
			totalReviews,
			totalActiveReviews,
			totalInactiveReviews,
			averageRating,
		] = await prisma.$transaction([
			prisma.publishedItineraryReview.count(),
			prisma.publishedItineraryReview.count({ where: { isHidden: false } }),
			prisma.publishedItineraryReview.count({ where: { isHidden: true } }),
			prisma.publishedItineraryReview.aggregate({
				_avg: {
					rating: true,
				},
			}),
		]);

		return {
			totalReviews,
			totalActiveReviews,
			totalInactiveReviews,
			averageRating: averageRating._avg.rating
				? Number(averageRating._avg.rating)
				: 0,
		};
	}
}

function buildReviewWhereInput(
	query: Pick<PublicGetReviewsQuery, "itineraryId" | "rating" | "search">,
	options: {
		isHidden?: boolean;
		publishedOnly?: boolean;
	},
): Prisma.PublishedItineraryReviewWhereInput {
	return {
		...(options.isHidden !== undefined ? { isHidden: options.isHidden } : {}),
		...(query.itineraryId ? { itineraryId: query.itineraryId } : {}),
		...(query.rating !== undefined ? { rating: query.rating } : {}),
		...(options.publishedOnly
			? { itinerary: { visibilityStatus: VisibilityStatus.PUBLISHED } }
			: {}),
		...(query.search
			? {
					OR: [
						{
							itinerary: {
								title: {
									contains: query.search,
									mode: "insensitive",
								},
							},
						},
						{
							reviewerUser: {
								fullName: {
									contains: query.search,
									mode: "insensitive",
								},
							},
						},
					],
				}
			: {}),
	};
}

function mapReviewSort(
	sortBy: PublicGetReviewsQuery["sortBy"],
): Prisma.PublishedItineraryReviewOrderByWithRelationInput {
	switch (sortBy) {
		case "titleAsc":
			return { itinerary: { title: "asc" } };
		case "titleDesc":
			return { itinerary: { title: "desc" } };
		case "createdAtAsc":
			return { createdAt: "asc" };
		case "ratingAsc":
			return { rating: "asc" };
		case "ratingDesc":
			return { rating: "desc" };
		case "createdAtDesc":
		default:
			return { createdAt: "desc" };
	}
}

export type ReviewItem = Prisma.PublishedItineraryReviewGetPayload<{
	select: typeof reviewSelect;
}>;

export default ReviewRepository;
