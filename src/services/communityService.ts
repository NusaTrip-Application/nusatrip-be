import { VisibilityStatus } from "../../generated/prisma/enums";
import { AppError } from "../middlewares/errorHandler";
import CommunityRepository from "../repositories/communityRepository";
import SavedReferenceRepository from "../repositories/savedReferenceRepository";
import ItineraryRepository from "../repositories/itineraryRepository";
import { prisma } from "../config/prisma";
import type {
	GetCommunityItinerariesQuery,
	GetOtherAuthorItinerariesQuery,
	GetSavedItinerariesQuery,
} from "../types/communityType";
import type { UserData } from "../types/authType";

class CommunityService {
	static async getCommunityItineraries(query: GetCommunityItinerariesQuery) {
		const { items, totalItems } =
			await CommunityRepository.findCommunityItineraries(query);
		const ratingStats = await buildItineraryRatingStatsMap(items);
		const totalPages = Math.max(1, Math.ceil(totalItems / query.limit));

		return {
			items: items.map((item) => mapCommunityItineraryListItem(item, ratingStats)),
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

	static async getCommunitySummary(itineraryId: string) {
		// Verify if itinerary exists and is published
		const itinerary = await ItineraryRepository.findById(itineraryId);
		if (!itinerary || itinerary.visibilityStatus !== VisibilityStatus.PUBLISHED) {
			throw new AppError("Published itinerary not found", 404);
		}

		const summary = await CommunityRepository.getCommunitySummary(itineraryId);

		return {
			averageRating: roundNumber(summary.averageRating),
			ratingCount: summary.totalReviews,
			totalReviews: summary.totalReviews,
			totalComments: summary.totalComments,
			totalSaves: summary.totalSaves,
		};
	}

	static async saveItinerary(currentUser: UserData, itineraryId: string) {
		const itinerary = await ItineraryRepository.findById(itineraryId);
		if (!itinerary || itinerary.visibilityStatus !== VisibilityStatus.PUBLISHED) {
			throw new AppError("Published itinerary not found", 404);
		}

		if (itinerary.userId === currentUser.id) {
			throw new AppError("You cannot save your own itinerary", 400);
		}

		const existingSave = await SavedReferenceRepository.findByUserAndItinerary(
			currentUser.id,
			itineraryId,
		);

		if (existingSave) {
			await prisma.savedReference.delete({
				where: {
					userId_itineraryId: {
						userId: currentUser.id,
						itineraryId,
					},
				},
			});
			return {
				saved: false,
				itineraryId,
			};
		}

		await SavedReferenceRepository.createSavedItinerary(currentUser.id, itineraryId);

		return {
			saved: true,
			itineraryId,
		};
	}

	static async getSavedItineraries(
		currentUser: UserData,
		query: GetSavedItinerariesQuery,
	) {
		const { items, totalItems } =
			await SavedReferenceRepository.findSavedItineraries(currentUser.id, query);
		const ratingStats = await buildItineraryRatingStatsMap(
			items.map((saved) => saved.itinerary),
		);
		const totalPages = Math.max(1, Math.ceil(totalItems / query.limit));

		return {
			items: items.map((saved) =>
				mapCommunityItineraryListItem(saved.itinerary, ratingStats, {
					savedReferenceId: saved.savedReferenceId,
					savedAt: saved.savedAt,
				}),
			),
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

	static async duplicateItinerary(currentUser: UserData, itineraryId: string) {
		const sourceItinerary = await prisma.itinerary.findUnique({
			where: { itineraryId },
			include: { items: true, interestCategories: true },
		});

		if (
			!sourceItinerary ||
			sourceItinerary.visibilityStatus !== VisibilityStatus.PUBLISHED
		) {
			throw new AppError("Published itinerary not found", 404);
		}

		if (sourceItinerary.userId === currentUser.id) {
			throw new AppError("You cannot duplicate your own itinerary", 400);
		}

		// Prevent duplicating an already duplicated itinerary again
		const existingDuplication =
			await prisma.duplicatedItineraryLineage.findFirst({
				where: {
					sourceItineraryId: itineraryId,
					duplicatedByUserId: currentUser.id,
				},
			});

		if (existingDuplication) {
			throw new AppError("You have already duplicated this itinerary", 409);
		}

		const duplicatedItinerary = await ItineraryRepository.duplicateItinerary(
			sourceItinerary,
			currentUser.id,
		);

		return mapCommunityItineraryDetail(duplicatedItinerary);
	}

	static async getOtherAuthorItineraries(
		itineraryId: string,
		query: GetOtherAuthorItinerariesQuery,
	) {
		const itinerary = await ItineraryRepository.findById(itineraryId);
		if (!itinerary || itinerary.visibilityStatus !== VisibilityStatus.PUBLISHED) {
			throw new AppError("Published itinerary not found", 404);
		}

		const { items, totalItems } =
			await CommunityRepository.findOtherAuthorItineraries(
				itineraryId,
				itinerary.userId,
				query,
			);
		const ratingStats = await buildItineraryRatingStatsMap(items);
		const totalPages = Math.max(1, Math.ceil(totalItems / query.limit));

		return {
			items: items.map((item) => mapCommunityItineraryListItem(item, ratingStats)),
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
}

type CommunityItineraryItem = Awaited<
	ReturnType<typeof CommunityRepository.findCommunityItineraries>
>["items"][number];

type SavedItineraryItem = Awaited<
	ReturnType<typeof SavedReferenceRepository.findSavedItineraries>
>["items"][number];

type CommunityItineraryDetail = NonNullable<
	Awaited<ReturnType<typeof ItineraryRepository.findById>>
>;

type ItineraryRatingStat = {
	averageRating: number;
	ratingCount: number;
};

async function buildItineraryRatingStatsMap(
	items: Array<Pick<CommunityItineraryItem, "itineraryId">>,
) {
	const stats = await ItineraryRepository.findItineraryRatingStatsByIds(
		items.map((item) => item.itineraryId),
	);

	return new Map<string, ItineraryRatingStat>(
		stats.map((item) => [
			item.itineraryId,
			{
				averageRating: Number(item._avg.rating ?? 0),
				ratingCount: item._count.rating,
			},
		]),
	);
}

function mapCommunityItineraryListItem(
	item: CommunityItineraryItem | SavedItineraryItem["itinerary"],
	ratingStats: Map<string, ItineraryRatingStat>,
	extra?: {
		savedReferenceId: string;
		savedAt: Date;
	},
) {
	const ratingStat = ratingStats.get(item.itineraryId);

	return {
		...(extra ?? {}),
		itineraryId: item.itineraryId,
		userId: item.userId,
		locationId: item.locationId,
		title: item.title,
		description: item.description,
		bannerImageUrl: item.bannerImageUrl,
		startDate: item.startDate,
		endDate: item.endDate,
		travelerCount: item.travelerCount,
		budgetPreference: item.budgetPreference ? Number(item.budgetPreference) : null,
		visibilityStatus: item.visibilityStatus,
		estimatedTotalBudget: item.estimatedTotalBudget
			? Number(item.estimatedTotalBudget)
			: null,
		createdAt: item.createdAt,
		updatedAt: item.updatedAt,
		location: item.location,
		user: {
			userId: item.user.userId,
			fullName: item.user.fullName,
			photoUrl: item.user.profilePhotoUrl,
		},
		ratingValue: roundNumber(ratingStat?.averageRating ?? 0),
		ratingCount: ratingStat?.ratingCount ?? item._count.reviews ?? 0,
		savedCount: item._count.savedReferences ?? 0,
		itemCount: item._count.items ?? 0,
	};
}

function mapCommunityItineraryDetail(itinerary: CommunityItineraryDetail | null) {
	if (!itinerary) {
		return itinerary;
	}

	const itineraryItemsByDay = itinerary.items.reduce<Record<string, unknown[]>>(
		(accumulator, item) => {
			const dateKey = item.visitDate.toISOString().slice(0, 10);
			if (!accumulator[dateKey]) {
				accumulator[dateKey] = [];
			}

			accumulator[dateKey].push({
				...item,
				visitTime: item.visitTime.toISOString().slice(11, 16),
				place: {
					...item.place,
					priceMin: item.place.priceMin ? Number(item.place.priceMin) : null,
					priceMax: item.place.priceMax ? Number(item.place.priceMax) : null,
					ratingValue: item.place.ratingValue ? Number(item.place.ratingValue) : null,
					categories: item.place.categoryMappings.map(
						(mapping) => mapping.category.categoryName,
					),
				},
			});

			return accumulator;
		},
		{},
	);

	return {
		itineraryId: itinerary.itineraryId,
		userId: itinerary.userId,
		locationId: itinerary.locationId,
		title: itinerary.title,
		description: itinerary.description,
		bannerImageUrl: itinerary.bannerImageUrl,
		startDate: itinerary.startDate,
		endDate: itinerary.endDate,
		travelerCount: itinerary.travelerCount,
		budgetPreference: itinerary.budgetPreference
			? Number(itinerary.budgetPreference)
			: null,
		visibilityStatus: itinerary.visibilityStatus,
		estimatedTotalBudget: itinerary.estimatedTotalBudget
			? Number(itinerary.estimatedTotalBudget)
			: null,
		createdAt: itinerary.createdAt,
		updatedAt: itinerary.updatedAt,
		location: itinerary.location,
		user: {
			userId: itinerary.user.userId,
			fullName: itinerary.user.fullName,
			photoUrl: itinerary.user.profilePhotoUrl,
		},
		interestCategories: itinerary.interestCategories.map((mapping) => ({
			categoryId: mapping.category.categoryId,
			categoryName: mapping.category.categoryName,
		})),
		itineraryItemsByDay,
	};
}

function roundNumber(value: number) {
	return Math.round(value * 100) / 100;
}

export default CommunityService;
