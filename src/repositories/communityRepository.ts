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

		let items: any[] = [];
		let totalItems = 0;

		if (query.filter === "popular") {
			totalItems = await prisma.itinerary.count({ where });

			let searchCond = "";
			const params: any[] = [];
			if (query.search) {
				searchCond = `AND (i.title ILIKE $1 OR l.location_name ILIKE $1)`;
				params.push(`%${query.search}%`);
			}

			const limitVal = query.limit;
			const offsetVal = skip;

			const sqlQuery = `
				SELECT i.itinerary_id as "itineraryId", COALESCE(AVG(r.rating), 0) as avg_rating
				FROM itineraries i
				LEFT JOIN published_itinerary_reviews r ON i.itinerary_id = r.itinerary_id
				LEFT JOIN locations l ON i.location_id = l.location_id
				WHERE i.visibility_status = 'PUBLISHED' ${searchCond}
				GROUP BY i.itinerary_id
				ORDER BY avg_rating DESC, i.created_at DESC
				LIMIT $${params.length + 1} OFFSET $${params.length + 2}
			`;

			const rawResults = await prisma.$queryRawUnsafe<{ itineraryId: string }[]>(
				sqlQuery,
				...params,
				limitVal,
				offsetVal
			);

			const ids = rawResults.map((r) => r.itineraryId);

			if (ids.length > 0) {
				const fetchedItems = await prisma.itinerary.findMany({
					where: {
						itineraryId: { in: ids },
					},
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
				});

				// Preserve raw query ordering
				items = ids
					.map((id) => fetchedItems.find((item) => item.itineraryId === id))
					.filter(Boolean);
			}
		} else {
			const orderBy: Prisma.ItineraryOrderByWithRelationInput = { createdAt: "desc" };

			const [fetchedItems, count] = await prisma.$transaction([
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
			items = fetchedItems;
			totalItems = count;
		}

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
