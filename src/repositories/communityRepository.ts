import { Prisma } from "../../generated/prisma/client";
import { VisibilityStatus } from "../../generated/prisma/enums";
import { prisma } from "../config/prisma";
import type { GetCommunityItinerariesQuery } from "../types/communityType";

class CommunityRepository {
	static async findCommunityItineraries(query: GetCommunityItinerariesQuery) {
		const skip = (query.page - 1) * query.limit;

		const where: Prisma.ItineraryWhereInput = {
			visibilityStatus: VisibilityStatus.PUBLISHED,
		};

		if (query.search) {
			where.OR = [
				{
					title: {
						contains: query.search,
						mode: "insensitive",
					},
				},
				{
					location: {
						locationName: {
							contains: query.search,
							mode: "insensitive",
						},
					},
				},
			];
		}

		let orderBy: Prisma.ItineraryOrderByWithRelationInput | Prisma.ItineraryOrderByWithRelationInput[] = {};

		if (query.filter === "popular") {
			// Sort by most saved and most reviewed
			orderBy = [
				{ savedReferences: { _count: "desc" } },
				{ reviews: { _count: "desc" } },
			];
		} else {
			// recent
			orderBy = { createdAt: "desc" };
		}

		const [items, totalItems] = await prisma.$transaction([
			prisma.itinerary.findMany({
				where,
				include: {
					location: true,
					user: {
						select: {
							userId: true,
							fullName: true,
							profilePhotoUrl: true,
						},
					},
					_count: {
						select: {
							reviews: true,
							savedReferences: true,
							items: true,
						},
					},
				},
				orderBy,
				skip,
				take: query.limit,
			}),
			prisma.itinerary.count({ where }),
		]);

		return { items, totalItems };
	}

	static async getCommunitySummary(itineraryId: string) {
		const [totalSaves, totalReviews, totalComments, ratingAggregate] = await prisma.$transaction([
			prisma.savedReference.count({ where: { itineraryId } }),
			prisma.publishedItineraryReview.count({ where: { itineraryId } }),
			prisma.publishedItineraryReview.count({
				where: {
					itineraryId,
					comment: {
						not: null,
					},
				},
			}),
			prisma.publishedItineraryReview.aggregate({
				where: { itineraryId },
				_avg: { rating: true },
			}),
		]);

		return {
			totalSaves,
			totalReviews,
			totalComments,
			averageRating: ratingAggregate._avg.rating
				? Number(ratingAggregate._avg.rating)
				: 0,
		};
	}

	static async findOtherAuthorItineraries(
		itineraryId: string,
		authorUserId: string,
		query: { page: number; limit: number },
	) {
		const skip = (query.page - 1) * query.limit;
		const where: Prisma.ItineraryWhereInput = {
			userId: authorUserId,
			visibilityStatus: VisibilityStatus.PUBLISHED,
			itineraryId: { not: itineraryId },
		};

		const [items, totalItems] = await prisma.$transaction([
			prisma.itinerary.findMany({
				where,
				include: {
					location: true,
					user: {
						select: {
							userId: true,
							fullName: true,
							profilePhotoUrl: true,
						},
					},
					_count: {
						select: {
							reviews: true,
							savedReferences: true,
							items: true,
						},
					},
				},
				orderBy: { createdAt: "desc" },
				skip,
				take: query.limit,
			}),
			prisma.itinerary.count({ where }),
		]);

		return { items, totalItems };
	}
}

export default CommunityRepository;
