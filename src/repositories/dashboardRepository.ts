import { prisma } from "../config/prisma";
import type {
	UserGrowthItem,
	PopularDestinationItem,
	RecentUser,
	RecentItinerary,
	RecentReview,
} from "../types/dashboardType";

class DashboardRepository {
	static async getTotalUsers(): Promise<number> {
		return prisma.user.count({
			where: { role: "USER" },
		});
	}

	static async getTotalLocations(): Promise<number> {
		return prisma.location.count();
	}

	static async getTotalPlaces(): Promise<number> {
		return prisma.place.count();
	}

	static async getTotalPublishedItineraries(): Promise<number> {
		return prisma.itinerary.count({
			where: { visibilityStatus: "PUBLISHED" },
		});
	}

	static async getUserGrowth(months: number = 6): Promise<UserGrowthItem[]> {
		const now = new Date();
		const results: UserGrowthItem[] = [];

		for (let i = months - 1; i >= 0; i--) {
			const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
			const year = date.getFullYear();
			const month = date.getMonth() + 1;
			const monthName = date.toLocaleString("default", { month: "short" });

			const startOfMonth = new Date(year, month - 1, 1);
			const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);

			const count = await prisma.user.count({
				where: {
					role: "USER",
					createdAt: {
						gte: startOfMonth,
						lte: endOfMonth,
					},
				},
			});

			results.push({
				month: monthName,
				year,
				count,
			});
		}

		return results;
	}

	static async getPopularDestinations(limit: number = 5): Promise<PopularDestinationItem[]> {
		const locations = await prisma.location.findMany({
			where: { isActive: true },
			select: {
				locationId: true,
				locationName: true,
				imageUrl: true,
				province: {
					select: {
						provinceName: true,
					},
				},
				_count: {
					select: {
						itineraries: {
							where: { visibilityStatus: "PUBLISHED" },
						},
					},
				},
			},
			orderBy: {
				itineraries: {
					_count: "desc",
				},
			},
			take: limit,
		});

		// Find max itinerary count to calculate percentage
		const maxCount = Math.max(
			...locations.map((loc) => loc._count.itineraries),
			1, // prevent division by zero
		);

		return locations.map((loc) => ({
			locationId: loc.locationId,
			locationName: loc.locationName,
			provinceName: loc.province.provinceName,
			imageUrl: loc.imageUrl,
			itineraryCount: loc._count.itineraries,
			percentage: Math.round((loc._count.itineraries / maxCount) * 100),
		}));
	}

	static async getRecentUsers(limit: number = 5): Promise<RecentUser[]> {
		return prisma.user.findMany({
			where: { role: "USER" },
			select: {
				userId: true,
				fullName: true,
				email: true,
				profilePhotoUrl: true,
				createdAt: true,
			},
			orderBy: { createdAt: "desc" },
			take: limit,
		});
	}

	static async getRecentPublishedItineraries(limit: number = 5): Promise<RecentItinerary[]> {
		const itineraries = await prisma.itinerary.findMany({
			where: { visibilityStatus: "PUBLISHED" },
			select: {
				itineraryId: true,
				title: true,
				bannerImageUrl: true,
				createdAt: true,
				location: {
					select: {
						locationName: true,
					},
				},
				user: {
					select: {
						fullName: true,
					},
				},
				_count: {
					select: {
						savedReferences: true,
					},
				},
				publishedItineraryReviews: {
					take: 1,
					orderBy: { createdAt: "desc" },
					select: {
						rating: true,
					},
				},
			},
			orderBy: { createdAt: "desc" },
			take: limit,
		});

		return itineraries.map((it) => {
			const latestReview = it.publishedItineraryReviews[0] as { rating: unknown } | undefined;
			return {
				itineraryId: it.itineraryId,
				title: it.title,
				bannerImageUrl: it.bannerImageUrl,
				locationName: it.location.locationName,
				userFullName: it.user.fullName,
				ratingValue: latestReview ? Number(latestReview.rating) : 0,
				savedCount: it._count.savedReferences,
				createdAt: it.createdAt,
			};
		});
	}

	static async getRecentReviews(limit: number = 5): Promise<RecentReview[]> {
		const reviews = await prisma.publishedItineraryReview.findMany({
			where: { isHidden: false },
			select: {
				reviewId: true,
				rating: true,
				comment: true,
				createdAt: true,
				itinerary: {
					select: {
						title: true,
					},
				},
				reviewerUser: {
					select: {
						fullName: true,
						profilePhotoUrl: true,
					},
				},
			},
			orderBy: { createdAt: "desc" },
			take: limit,
		});

		return reviews.map((review) => ({
			reviewId: review.reviewId,
			rating: Number(review.rating),
			comment: review.comment,
			createdAt: review.createdAt,
			itineraryTitle: review.itinerary.title,
			reviewerFullName: review.reviewerUser.fullName,
			reviewerPhotoUrl: review.reviewerUser.profilePhotoUrl,
		}));
	}
}

export default DashboardRepository;