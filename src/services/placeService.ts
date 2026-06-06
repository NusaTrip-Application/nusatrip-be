import { DayOfWeek, PlaceCategoryEnum } from "../../generated/prisma/enums";
import type { Prisma } from "../../generated/prisma/client";
import { AppError } from "../middlewares/errorHandler";
import MediaService from "./mediaService";
import LocationRepository from "../repositories/locationRepository";
import PlaceRepository, {
	type PlaceDetail,
	type RecommendationPlace,
} from "../repositories/placeRepository";
import type {
	AdminGetPlacesQuery,
	CreatePlacePayload,
	GetPlaceRecommendationsQuery,
	UpdatePlacePayload,
} from "../types/placeType";

class PlaceService {
	static async getPlaceCategories() {
		return PlaceRepository.findActiveCategories();
	}

	static async createPlace(currentUserId: string, payload: CreatePlacePayload) {
		await ensureActiveLocationExists(payload.locationId);
		await ensureActiveCategoryIdsExist(payload.categories);

		const createPayload = buildPlaceCreateInput(payload);

		const place = await PlaceRepository.createPlace(createPayload);

		if (payload.images && payload.images.length > 0) {
			const finalImages: Array<{ imageUrl: string; displayOrder: number }> = [];
			for (const img of payload.images) {
				if (img.imageUrl.startsWith("temp/")) {
					await MediaService.validateTempKey(img.imageUrl, currentUserId, "place");
					const finalKey = await MediaService.promoteToFinal(
						img.imageUrl,
						place.placeId,
						"place",
					);
					finalImages.push({ imageUrl: finalKey, displayOrder: img.displayOrder });
					await MediaService.deleteFile(img.imageUrl);
				} else {
					finalImages.push(img);
				}
			}
			
			await PlaceRepository.updatePlaceById(place.placeId, {
				images: {
					deleteMany: {},
					create: finalImages.map((item) => ({
						imageUrl: item.imageUrl,
						displayOrder: item.displayOrder,
					})),
				},
			});

			return this.getPlaceById(place.placeId);
		}

		return place;
	}

	static async updatePlace(currentUserId: string, placeId: string, payload: UpdatePlacePayload) {
		const oldPlace = await PlaceRepository.findById(placeId);

		if (!oldPlace) {
			throw new AppError("Place not found", 404);
		}

		if (payload.locationId) {
			await ensureActiveLocationExists(payload.locationId);
		}

		if (payload.categories) {
			await ensureActiveCategoryIdsExist(payload.categories);
		}

		if (payload.images) {
			const finalImages: Array<{ imageUrl: string; displayOrder: number }> = [];
			
			for (const img of payload.images) {
				if (img.imageUrl.startsWith("temp/")) {
					await MediaService.validateTempKey(img.imageUrl, currentUserId, "place");
					const finalKey = await MediaService.promoteToFinal(
						img.imageUrl,
						placeId,
						"place",
					);
					finalImages.push({ imageUrl: finalKey, displayOrder: img.displayOrder });
					await MediaService.deleteFile(img.imageUrl);
				} else {
					finalImages.push(img);
				}
			}

			const finalImageUrls = new Set(finalImages.map(img => img.imageUrl));
			for (const oldImg of oldPlace.images) {
				if (!finalImageUrls.has(oldImg.imageUrl)) {
					await MediaService.deleteFile(oldImg.imageUrl);
				}
			}

			payload.images = finalImages;
		}

		const updatePayload = buildPlaceUpdateInput(payload);

		return PlaceRepository.updatePlaceById(placeId, updatePayload);
	}

	static async deletePlace(placeId: string) {
		const place = await PlaceRepository.findById(placeId);

		if (!place) {
			throw new AppError("Place not found", 404);
		}

		const usageCount = await PlaceRepository.countPlaceUsage(placeId);
		if (usageCount > 0) {
			throw new AppError(
				"Place cannot be deleted because it is still used by itinerary items",
				409,
			);
		}

		if (place.images && place.images.length > 0) {
			for (const img of place.images) {
				await MediaService.deleteFile(img.imageUrl);
			}
		}

		return PlaceRepository.deletePlaceById(placeId);
	}

	static async getAdminPlaces(query: AdminGetPlacesQuery) {
		const { items, totalItems } = await PlaceRepository.findAdminPlaces(query);
		const totalPages = Math.max(1, Math.ceil(totalItems / query.limit));

		return {
			items: items.map(mapPlaceListItem),
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

	static async getPlaceById(placeId: string) {
		const place = await PlaceRepository.findById(placeId);

		if (!place) {
			throw new AppError("Place not found", 404);
		}

		return mapPlaceDetail(place);
	}

	static async getActivePlaceById(placeId: string) {
		const place = await PlaceRepository.findActiveById(placeId);

		if (!place) {
			throw new AppError("Place not found", 404);
		}

		return mapPlaceDetail(place);
	}

	static async getPlaceSummary() {
		return PlaceRepository.getPlaceSummary();
	}

	static async getPlaceRecommendations(query: GetPlaceRecommendationsQuery) {
		const places = await PlaceRepository.findRecommendedPlaces(query);
		const scoredPlaces = places
			.map((place) => buildRecommendationItem(place, query))
			.sort(
				(a, b) => b.finalScore - a.finalScore || b.ratingValue - a.ratingValue,
			);

		const startIndex = (query.page - 1) * query.limit;
		const items = scoredPlaces.slice(startIndex, startIndex + query.limit);
		const totalItems = scoredPlaces.length;
		const totalPages = Math.max(1, Math.ceil(totalItems / query.limit));

		return {
			items,
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

async function ensureActiveLocationExists(locationId: string) {
	const location = await LocationRepository.findActiveById(locationId);
	if (!location) {
		throw new AppError("Active location not found", 404);
	}
}

async function ensureActiveCategoryIdsExist(categoryIds: string[]) {
	const categories = await PlaceRepository.findActiveCategoriesByIds(categoryIds);

	if (categories.length !== categoryIds.length) {
		throw new AppError("One or more categories are invalid or inactive", 400);
	}
}

function buildPlaceCreateInput(
	payload: CreatePlacePayload,
): Prisma.PlaceCreateInput {
	return {
		location: {
			connect: {
				locationId: payload.locationId,
			},
		},
		placeName: payload.placeName,
		address: payload.address,
		...(payload.shortDescription
			? { shortDescription: payload.shortDescription }
			: {}),
		...(payload.priceMin !== undefined ? { priceMin: payload.priceMin } : {}),
		...(payload.priceMax !== undefined ? { priceMax: payload.priceMax } : {}),
		...(payload.priceDescription
			? { priceDescription: payload.priceDescription }
			: {}),
		...(payload.websiteUrl ? { websiteUrl: payload.websiteUrl } : {}),
		...(payload.contactPhoneNumber
			? { contactPhoneNumber: payload.contactPhoneNumber }
			: {}),
		...(payload.ratingValue !== undefined
			? { ratingValue: payload.ratingValue }
			: {}),
		...(payload.ratingCount !== undefined
			? { ratingCount: payload.ratingCount }
			: {}),
		categoryMappings: {
			create: payload.categories.map((categoryId) => ({
				category: {
					connect: {
						categoryId,
					},
				},
			})),
		},
		operatingHours: {
			create: payload.operatingHours.map((item) => ({
				dayOfWeek: item.dayOfWeek,
				isClosed: item.isClosed,
				...(item.openTime ? { openTime: toTimeDate(item.openTime) } : {}),
				...(item.closeTime ? { closeTime: toTimeDate(item.closeTime) } : {}),
			})),
		},
		...(payload.images
			? {
					images: {
						create: payload.images.map((item) => ({
							imageUrl: item.imageUrl,
							displayOrder: item.displayOrder,
						})),
					},
				}
			: {}),
	};
}

function buildPlaceUpdateInput(
	payload: UpdatePlacePayload,
): Prisma.PlaceUpdateInput {
	const normalizedPayload = normalizeOptionalStringFields(payload);
	const updatePayload: Prisma.PlaceUpdateInput = {};

	if (normalizedPayload.locationId) {
		updatePayload.location = {
			connect: {
				locationId: normalizedPayload.locationId,
			},
		};
	}

	if (normalizedPayload.placeName !== undefined) {
		updatePayload.placeName = normalizedPayload.placeName;
	}

	if (normalizedPayload.shortDescription !== undefined) {
		updatePayload.shortDescription = normalizedPayload.shortDescription;
	}

	if (normalizedPayload.address !== undefined) {
		updatePayload.address = normalizedPayload.address;
	}

	if (normalizedPayload.priceMin !== undefined) {
		updatePayload.priceMin = normalizedPayload.priceMin;
	}

	if (normalizedPayload.priceMax !== undefined) {
		updatePayload.priceMax = normalizedPayload.priceMax;
	}

	if (normalizedPayload.priceDescription !== undefined) {
		updatePayload.priceDescription = normalizedPayload.priceDescription;
	}

	if (normalizedPayload.websiteUrl !== undefined) {
		updatePayload.websiteUrl = normalizedPayload.websiteUrl;
	}

	if (normalizedPayload.contactPhoneNumber !== undefined) {
		updatePayload.contactPhoneNumber = normalizedPayload.contactPhoneNumber;
	}

	if (normalizedPayload.ratingValue !== undefined) {
		updatePayload.ratingValue = normalizedPayload.ratingValue;
	}

	if (normalizedPayload.ratingCount !== undefined) {
		updatePayload.ratingCount = normalizedPayload.ratingCount;
	}

	if (normalizedPayload.isActive !== undefined) {
		updatePayload.isActive = normalizedPayload.isActive;
	}

	if (normalizedPayload.categories) {
		updatePayload.categoryMappings = {
			deleteMany: {},
			create: normalizedPayload.categories.map((categoryId) => ({
				category: {
					connect: {
						categoryId,
					},
				},
			})),
		};
	}

	if (normalizedPayload.operatingHours) {
		updatePayload.operatingHours = {
			deleteMany: {},
			create: normalizedPayload.operatingHours.map((item) => ({
				dayOfWeek: item.dayOfWeek,
				isClosed: item.isClosed,
				...(item.openTime ? { openTime: toTimeDate(item.openTime) } : {}),
				...(item.closeTime ? { closeTime: toTimeDate(item.closeTime) } : {}),
			})),
		};
	}

	if (normalizedPayload.images) {
		updatePayload.images = {
			deleteMany: {},
			create: normalizedPayload.images.map((item) => ({
				imageUrl: item.imageUrl,
				displayOrder: item.displayOrder,
			})),
		};
	}

	return updatePayload;
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

function toTimeDate(time: string) {
	return new Date(`1970-01-01T${time}:00.000Z`);
}

function mapPlaceListItem(
	item: Awaited<
		ReturnType<typeof PlaceRepository.findAdminPlaces>
	>["items"][number],
) {
	const categories = item.categoryMappings.map((mapping) => ({
		categoryId: mapping.category.categoryId,
		categoryName: mapping.category.categoryName,
	}));

	return {
		placeId: item.placeId,
		placeName: item.placeName,
		shortDescription: item.shortDescription,
		address: item.address,
		priceMin: item.priceMin ? Number(item.priceMin) : null,
		priceMax: item.priceMax ? Number(item.priceMax) : null,
		priceDescription: item.priceDescription,
		websiteUrl: item.websiteUrl,
		contactPhoneNumber: item.contactPhoneNumber,
		ratingValue: item.ratingValue ? Number(item.ratingValue) : null,
		ratingCount: item.ratingCount ?? null,
		isActive: item.isActive,
		createdAt: item.createdAt,
		updatedAt: item.updatedAt,
		location: item.location,
		categories,
		images: item.images,
	};
}

function mapPlaceDetail(place: PlaceDetail) {
	const categories = place.categoryMappings.map((mapping) => ({
		categoryId: mapping.category.categoryId,
		categoryName: mapping.category.categoryName,
	}));

	return {
		placeId: place.placeId,
		locationId: place.locationId,
		placeName: place.placeName,
		shortDescription: place.shortDescription,
		address: place.address,
		priceMin: place.priceMin ? Number(place.priceMin) : null,
		priceMax: place.priceMax ? Number(place.priceMax) : null,
		priceDescription: place.priceDescription,
		websiteUrl: place.websiteUrl,
		contactPhoneNumber: place.contactPhoneNumber,
		ratingValue: place.ratingValue ? Number(place.ratingValue) : null,
		ratingCount: place.ratingCount ?? null,
		isActive: place.isActive,
		createdAt: place.createdAt,
		updatedAt: place.updatedAt,
		location: place.location,
		categories,
		operatingHours: place.operatingHours.map((item) => ({
			...item,
			openTime: item.openTime ? toTimeString(item.openTime) : null,
			closeTime: item.closeTime ? toTimeString(item.closeTime) : null,
		})),
	};
}

function toTimeString(value: Date) {
	return value.toISOString().slice(11, 16);
}

function buildRecommendationItem(
	place: RecommendationPlace,
	query: GetPlaceRecommendationsQuery,
) {
	const categories = place.categoryMappings.map((mapping) => ({
		categoryId: mapping.category.categoryId,
		categoryName: mapping.category.categoryName,
	}));
	const categoryScore = getCategoryScore(categories, query.categories);
	const ratingValue = place.ratingValue ? Number(place.ratingValue) : 0;
	const priceMin = place.priceMin ? Number(place.priceMin) : null;
	const priceMax = place.priceMax ? Number(place.priceMax) : null;
	const ratingCount = place.ratingCount ?? 0;
	const responseRatingCount = place.ratingCount ?? null;
	const ratingScore = Math.min(25, (ratingValue / 5) * 25);
	const popularityScore = Math.min(15, (ratingCount / 100) * 15);
	const priceScore = getPriceScore(priceMin, priceMax, query.budgetPreference);
	const finalScore = roundScore(
		categoryScore + ratingScore + popularityScore + priceScore,
	);

	return {
		placeId: place.placeId,
		placeName: place.placeName,
		shortDescription: place.shortDescription,
		address: place.address,
		priceMin,
		priceMax,
		priceDescription: place.priceDescription,
		ratingValue,
		ratingCount: responseRatingCount,
		location: place.location,
		categories,
		image: place.images[0] ?? null,
		recommendationBreakdown: {
			categoryScore: roundScore(categoryScore),
			ratingScore: roundScore(ratingScore),
			popularityScore: roundScore(popularityScore),
			priceScore: roundScore(priceScore),
		},
		finalScore,
	};
}

function getCategoryScore(
	placeCategories: Array<{ categoryId: string; categoryName: PlaceCategoryEnum }>,
	requestedCategories?: PlaceCategoryEnum[],
) {
	if (!requestedCategories || requestedCategories.length === 0) {
		return 0;
	}

	const matchedCount = requestedCategories.filter((category) =>
		placeCategories.some((placeCategory) => placeCategory.categoryName === category),
	).length;

	return (matchedCount / requestedCategories.length) * 50;
}

function getPriceScore(
	priceMin: number | null,
	priceMax: number | null,
	budgetPreference?: number,
) {
	if (!budgetPreference) {
		return 0;
	}

	const estimatedPrice = getEstimatedPlacePrice(priceMin, priceMax);
	if (!estimatedPrice || estimatedPrice <= 0) {
		return 0;
	}

	const budgetUsageRatio = estimatedPrice / budgetPreference;

	if (budgetUsageRatio < 0.5) {
		return 10;
	}

	if (budgetUsageRatio < 1) {
		return 4;
	}

	return 0;
}

function getEstimatedPlacePrice(priceMin: number | null, priceMax: number | null) {
	if (priceMin !== null && priceMax !== null) {
		return (priceMin + priceMax) / 2;
	}

	if (priceMin !== null) {
		return priceMin;
	}

	if (priceMax !== null) {
		return priceMax;
	}

	return null;
}

function roundScore(value: number) {
	return Math.round(value * 100) / 100;
}

export default PlaceService;
