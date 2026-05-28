import { UserRole, VisibilityStatus } from "../../generated/prisma/enums";
import type { Prisma } from "../../generated/prisma/client";
import { AppError } from "../middlewares/errorHandler";
import ItineraryRepository, {
	type ItineraryDetailItem,
	type ItineraryListItem,
} from "../repositories/itineraryRepository";
import LocationRepository from "../repositories/locationRepository";
import type {
	AdminGetItinerariesQuery,
	CreateItineraryPayload,
	GetMyItinerariesQuery,
	UpdateBudgetPayload,
	UpdateItineraryPayload,
} from "../types/itineraryType";
import type { UserData } from "../types/authType";

class ItineraryService {
	static async createItinerary(userId: string, payload: CreateItineraryPayload) {
		await ensureLocationExists(payload.locationId);
		const interestCategoryIds = getUniqueCategoryIds(payload.interestSummary);
		await ensureInterestCategoriesExist(interestCategoryIds);

		const createPayload: Prisma.ItineraryCreateInput = {
			user: {
				connect: {
					userId,
				},
			},
			location: {
				connect: {
					locationId: payload.locationId,
				},
			},
			title: payload.title,
			startDate: payload.startDate,
			endDate: payload.endDate,
			travelerCount: payload.travelerCount,
			budgetPreference: payload.budgetPreference,
		};

		return ItineraryRepository.createItinerary(createPayload, interestCategoryIds);
	}

	static async updateItinerary(
		currentUser: UserData,
		itineraryId: string,
		payload: UpdateItineraryPayload,
	) {
		const itinerary = await this.getAccessibleItinerary(currentUser, itineraryId);

		if (payload.locationId) {
			await ensureLocationExists(payload.locationId);
		}

		const interestCategoryIds =
			payload.interestSummary !== undefined
				? getUniqueCategoryIds(payload.interestSummary)
				: undefined;

		if (interestCategoryIds !== undefined) {
			await ensureInterestCategoriesExist(interestCategoryIds);
		}

		const normalizedPayload = normalizeOptionalStringFields(payload);
		const updatePayload: Prisma.ItineraryUpdateInput = {};

		if (normalizedPayload.title !== undefined) {
			updatePayload.title = normalizedPayload.title;
		}

		if (normalizedPayload.startDate !== undefined) {
			updatePayload.startDate = normalizedPayload.startDate;
		}

		if (normalizedPayload.endDate !== undefined) {
			updatePayload.endDate = normalizedPayload.endDate;
		}

		if (normalizedPayload.travelerCount !== undefined) {
			updatePayload.travelerCount = normalizedPayload.travelerCount;
		}

		if (normalizedPayload.budgetPreference !== undefined) {
			updatePayload.budgetPreference = normalizedPayload.budgetPreference;
		}

		if (normalizedPayload.visibilityStatus !== undefined) {
			updatePayload.visibilityStatus = normalizedPayload.visibilityStatus;
		}

		if (normalizedPayload.locationId) {
			updatePayload.location = {
				connect: {
					locationId: normalizedPayload.locationId,
				},
			};
		}

		if (
			updatePayload.startDate &&
			!updatePayload.endDate &&
			itinerary.endDate < (updatePayload.startDate as Date)
		) {
			throw new AppError("endDate must be greater than or equal to startDate", 400);
		}

		if (
			updatePayload.endDate &&
			!updatePayload.startDate &&
			(updatePayload.endDate as Date) < itinerary.startDate
		) {
			throw new AppError("endDate must be greater than or equal to startDate", 400);
		}

		return ItineraryRepository.updateItineraryById(
			itineraryId,
			updatePayload,
			interestCategoryIds,
		);
	}

	static async deleteItinerary(currentUser: UserData, itineraryId: string) {
		await this.getAccessibleItinerary(currentUser, itineraryId);

		return ItineraryRepository.deleteItineraryById(itineraryId);
	}

	static async updateEstimatedTotalBudget(
		currentUser: UserData,
		itineraryId: string,
		payload: UpdateBudgetPayload,
	) {
		await this.getAccessibleItinerary(currentUser, itineraryId);

		return ItineraryRepository.updateItineraryById(itineraryId, {
			estimatedTotalBudget: payload.estimatedTotalBudget,
		});
	}

	static async getMyItineraries(userId: string, query: GetMyItinerariesQuery) {
		const items = await ItineraryRepository.findMyItineraries(
			userId,
			query,
		);
		const ratingStats = await buildItineraryRatingStatsMap(items);
		const sortedItems = paginateAndSortItineraries(items, query, ratingStats);
		const totalItems = items.length;
		const totalPages = Math.max(1, Math.ceil(totalItems / query.limit));

		return {
			items: sortedItems.map((item) => mapMyItineraryListItem(item, ratingStats)),
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

	static async getItineraryDetail(currentUser: UserData, itineraryId: string) {
		await this.getAccessibleItinerary(currentUser, itineraryId);

		const itinerary = await ItineraryRepository.findItineraryDetailById(
			itineraryId,
		);

		if (!itinerary) {
			throw new AppError("Itinerary not found", 404);
		}

		return mapItineraryDetail(itinerary);
	}

	static async getAdminItineraries(query: AdminGetItinerariesQuery) {
		const items = await ItineraryRepository.findAdminItineraries(query);
		const ratingStats = await buildItineraryRatingStatsMap(items);
		const sortedItems = paginateAndSortItineraries(items, query, ratingStats);
		const totalItems = items.length;
		const totalPages = Math.max(1, Math.ceil(totalItems / query.limit));

		return {
			items: sortedItems.map((item) => mapAdminItineraryListItem(item)),
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

	static async getItinerarySummary() {
		return ItineraryRepository.getItinerarySummary();
	}

	private static async getAccessibleItinerary(
		currentUser: UserData,
		itineraryId: string,
	) {
		const itinerary = await ItineraryRepository.findById(itineraryId);
		if (!itinerary) {
			throw new AppError("Itinerary not found", 404);
		}

		if (
			currentUser.role !== UserRole.ADMIN &&
			itinerary.userId !== currentUser.id
		) {
			throw new AppError("Forbidden", 403);
		}

		return itinerary;
	}
}

async function ensureLocationExists(locationId: string) {
	const location = await LocationRepository.findActiveById(locationId);
	if (!location) {
		throw new AppError("Active location not found", 404);
	}
}

async function ensureInterestCategoriesExist(categoryIds: string[]) {
	if (categoryIds.length === 0) {
		return;
	}

	const categories = await ItineraryRepository.findActiveCategoriesByIds(categoryIds);
	const foundCategoryIds = new Set(categories.map((category) => category.categoryId));

	if (foundCategoryIds.size !== categoryIds.length) {
		throw new AppError("One or more categories not found", 404);
	}
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

function getUniqueCategoryIds(categoryIds?: string[]) {
	if (!categoryIds) {
		return [];
	}

	return [...new Set(categoryIds)];
}

function paginateAndSortItineraries<
	T extends ItineraryListItem,
>(
	items: T[],
	query: {
		sortBy: "titleAsc" | "titleDesc" | "createdAtDesc" | "createdAtAsc" | "ratingAsc" | "ratingDesc";
		page: number;
		limit: number;
	},
	ratingStats: Map<string, ItineraryRatingStat>,
) {
	const sorted = [...items].sort((a, b) => {
		switch (query.sortBy) {
			case "titleAsc":
				return (a.title ?? "").localeCompare(b.title ?? "");
			case "titleDesc":
				return (b.title ?? "").localeCompare(a.title ?? "");
			case "createdAtAsc":
				return a.createdAt.getTime() - b.createdAt.getTime();
			case "ratingAsc":
				return getAverageRatingFromStats(a.itineraryId, ratingStats) - getAverageRatingFromStats(b.itineraryId, ratingStats);
			case "ratingDesc":
				return getAverageRatingFromStats(b.itineraryId, ratingStats) - getAverageRatingFromStats(a.itineraryId, ratingStats);
			case "createdAtDesc":
			default:
				return b.createdAt.getTime() - a.createdAt.getTime();
		}
	});

	const startIndex = (query.page - 1) * query.limit;
	return sorted.slice(startIndex, startIndex + query.limit);
}

function mapMyItineraryListItem(
	item: ItineraryListItem,
	ratingStats: Map<string, ItineraryRatingStat>,
) {
	const interestCategories = item.interestCategories.map((mapping) => ({
		categoryId: mapping.category.categoryId,
		categoryName: mapping.category.categoryName,
	}));
	const ratingStat = ratingStats.get(item.itineraryId);
	const isPublished = item.visibilityStatus === VisibilityStatus.PUBLISHED;

	return {
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
			email: item.user.email,
			photoUrl: item.user.profilePhotoUrl,
		},
		interestCategories,
		ratingValue: isPublished ? roundNumber(ratingStat?.averageRating ?? 0) : null,
		ratingCount: isPublished ? ratingStat?.ratingCount ?? 0 : 0,
		savedCount: isPublished ? item._count?.savedReferences ?? 0 : 0,
		itemCount: item._count?.items ?? 0,
	};
}

function mapAdminItineraryListItem(item: ItineraryListItem) {
	const interestCategories = item.interestCategories.map((mapping) => ({
		categoryId: mapping.category.categoryId,
		categoryName: mapping.category.categoryName,
	}));

	return {
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
			email: item.user.email,
			photoUrl: item.user.profilePhotoUrl,
		},
		interestCategories,
		itemCount: item._count?.items ?? 0,
	};
}

function mapItineraryDetail(
	itinerary: ItineraryDetailItem | null,
) {
	if (!itinerary) {
		return itinerary;
	}

	const itineraryItemsByDay = itinerary.items.reduce<Record<string, unknown[]>>(
		(accumulator, item: ItineraryDetailItem["items"][number]) => {
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
						(mapping: ItineraryDetailItem["items"][number]["place"]["categoryMappings"][number]) =>
							mapping.category.categoryName,
					),
				},
			});

			return accumulator;
		},
		{},
	);
	const interestCategories = itinerary.interestCategories.map((mapping) => ({
		categoryId: mapping.category.categoryId,
		categoryName: mapping.category.categoryName,
	}));

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
		interestCategories,
		itineraryItemsByDay,
	};
}

async function buildItineraryRatingStatsMap(items: ItineraryListItem[]) {
	const stats = await ItineraryRepository.findItineraryRatingStatsByIds(
		items.map((item) => item.itineraryId),
	);

	return new Map(
		stats.map((item) => [
			item.itineraryId,
			{
				averageRating: Number(item._avg.rating ?? 0),
				ratingCount: item._count.rating,
			},
		]),
	);
}

function getAverageRatingFromStats(
	itineraryId: string,
	ratingStats: Map<string, ItineraryRatingStat>,
) {
	return ratingStats.get(itineraryId)?.averageRating ?? 0;
}

function roundNumber(value: number) {
	return Math.round(value * 100) / 100;
}

type ItineraryRatingStat = {
	averageRating: number;
	ratingCount: number;
};

export default ItineraryService;
