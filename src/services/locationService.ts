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

class LocationService {
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

	static async createLocation(payload: CreateLocationPayload) {
		const existingLocation = await LocationRepository.findByName(payload.locationName);

		if (existingLocation) {
			throw new AppError("Location name is already registered", 409);
		}

		const createPayload: Prisma.LocationCreateInput = {
			locationName: payload.locationName,
			provinceName: payload.provinceName,
			...(payload.description ? { description: payload.description } : {}),
			...(payload.imageUrl ? { imageUrl: payload.imageUrl } : {}),
		};

		return LocationRepository.createLocation(createPayload);
	}

	static async updateLocation(locationId: string, payload: UpdateLocationPayload) {
		const location = await this.getLocationById(locationId);
		const normalizedPayload = normalizeOptionalStringFields(payload);
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

		return LocationRepository.updateLocationById(locationId, updatePayload);
	}

	static async deleteLocation(locationId: string) {
		await this.getLocationById(locationId);

		const usage = await LocationRepository.countLocationUsage(locationId);

		if (usage.placesCount > 0 || usage.itinerariesCount > 0) {
			throw new AppError(
				"Location cannot be deleted because it is still used by places or itineraries",
				409,
			);
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
	return Object.fromEntries(
		Object.entries(payload).filter(([, value]) => value !== undefined),
	) as Prisma.LocationUpdateInput;
}

export default LocationService;
