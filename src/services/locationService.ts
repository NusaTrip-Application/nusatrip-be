import type { Prisma } from "../../generated/prisma/client";
import LocationRepository from "../repositories/locationRepository";
import type {
	AdminGetLocationsQuery,
	ChangeLocationStatusPayload,
	CreateLocationPayload,
	PublicGetLocationsQuery,
	UpdateLocationPayload,
} from "../types/locationType";
import { AppError } from "../middlewares/errorHandler";
import MediaService from "./mediaService";

class LocationService {
	static async getActiveProvinces() {
		return LocationRepository.findActiveProvinces();
	}

	static async getActiveLocationOptions() {
		return LocationRepository.findActiveLocationOptions();
	}

	static async getPublicLocations(query: PublicGetLocationsQuery) {
		const { items, totalItems } = await LocationRepository.findPublicLocations(query);
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

	static async getAdminLocations(query: AdminGetLocationsQuery) {
		const { items, totalItems } = await LocationRepository.findAdminLocations(query);
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

	static async getActiveLocationById(locationId: string) {
		const location = await LocationRepository.findActiveById(locationId);

		if (!location) {
			throw new AppError("Location not found", 404);
		}

		return location;
	}

	static async getLocationById(locationId: string) {
		const location = await LocationRepository.findById(locationId);

		if (!location) {
			throw new AppError("Location not found", 404);
		}

		return location;
	}

	static async getLocationSummary() {
		return LocationRepository.getLocationSummary();
	}

	static async createLocation(currentUserId: string, payload: CreateLocationPayload) {
		await ensureActiveProvinceExists(payload.provinceId);
		const existingLocation = await LocationRepository.findByName(payload.locationName);

		if (existingLocation) {
			throw new AppError("Location name is already registered", 409);
		}

		const createPayload: Prisma.LocationCreateInput = {
			province: {
				connect: {
					provinceId: payload.provinceId,
				},
			},
			locationName: payload.locationName,
			...(payload.description ? { description: payload.description } : {}),
		};

		const location = await LocationRepository.createLocation(createPayload);

		if (payload.imageUrl) {
			await MediaService.validateTempKey(payload.imageUrl, currentUserId, "location");
			const finalKey = await MediaService.promoteToFinal(
				payload.imageUrl,
				location.locationId,
				"location",
			);
			await LocationRepository.updateLocationById(location.locationId, { imageUrl: finalKey });
			location.imageUrl = finalKey;
		}

		return location;
	}

	static async updateLocation(currentUserId: string, locationId: string, payload: UpdateLocationPayload) {
		const location = await this.getLocationById(locationId);
		const normalizedPayload = normalizeOptionalStringFields(payload);
		if (normalizedPayload.provinceId) {
			await ensureActiveProvinceExists(normalizedPayload.provinceId);
		}
		const updatePayload = toLocationUpdateInput(normalizedPayload);
		const nextLocationName =
			typeof normalizedPayload.locationName === "string"
				? normalizedPayload.locationName
				: undefined;

		if (nextLocationName && nextLocationName !== location.locationName) {
			const existingLocation = await LocationRepository.findByName(nextLocationName);

			if (existingLocation && existingLocation.locationId !== locationId) {
				throw new AppError("Location name is already registered", 409);
			}
		}

		if (normalizedPayload.imageUrl !== undefined) {
			if (normalizedPayload.imageUrl === null) {
				updatePayload.imageUrl = null;
				if (location.imageUrl) {
					await MediaService.deleteFile(location.imageUrl);
				}
			} else {
				await MediaService.validateTempKey(
					normalizedPayload.imageUrl as string,
					currentUserId,
					"location",
				);
				const finalKey = await MediaService.promoteToFinal(
					normalizedPayload.imageUrl as string,
					locationId,
					"location",
				);
				updatePayload.imageUrl = finalKey;
				if (location.imageUrl) {
					await MediaService.deleteFile(location.imageUrl);
				}
			}
		}

		return LocationRepository.updateLocationById(locationId, updatePayload);
	}

	static async deleteLocation(locationId: string) {
		const location = await this.getLocationById(locationId);

		const usage = await LocationRepository.countLocationUsage(locationId);

		if (usage.placesCount > 0 || usage.itinerariesCount > 0) {
			throw new AppError(
				"Location cannot be deleted because it is still used by places or itineraries",
				409,
			);
		}

		if (location.imageUrl) {
			await MediaService.deleteFile(location.imageUrl);
		}

		return LocationRepository.deleteLocationById(locationId);
	}

	static async changeLocationStatus(
		locationId: string,
		payload: ChangeLocationStatusPayload,
	) {
		const location = await this.getLocationById(locationId);

		if (location.isActive === payload.isActive) {
			throw new AppError(
				"Location status is already set to the requested value",
				400,
			);
		}

		return LocationRepository.updateLocationById(locationId, {
			isActive: payload.isActive,
		});
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

function toLocationUpdateInput(
	payload: UpdateLocationPayload,
): Prisma.LocationUpdateInput {
	const entries = Object.entries(payload).filter(([, value]) => value !== undefined);
	const updatePayload = Object.fromEntries(
		entries.filter(([key]) => key !== "provinceId" && key !== "imageUrl"),
	) as Prisma.LocationUpdateInput;

	if (typeof payload.provinceId === "string") {
		updatePayload.province = {
			connect: {
				provinceId: payload.provinceId,
			},
		};
	}

	return updatePayload;
}

async function ensureActiveProvinceExists(provinceId: string) {
	const province = await LocationRepository.findActiveProvinceById(provinceId);

	if (!province) {
		throw new AppError("Active province not found", 404);
	}
}

export default LocationService;
