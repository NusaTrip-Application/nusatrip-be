import type { Prisma } from "../../generated/prisma/client";
import { prisma } from "../config/prisma";
import type {
	AdminGetLocationsQuery,
	PublicGetLocationsQuery,
} from "../types/locationType";

const adminLocationSelect = {
	locationId: true,
	locationName: true,
	provinceName: true,
	description: true,
	imageUrl: true,
	isActive: true,
	createdAt: true,
	updatedAt: true,
} as const;

class LocationRepository {
	static async findByName(locationName: string) {
		return prisma.location.findFirst({
			where: {
				locationName: {
					equals: locationName,
					mode: "insensitive",
				},
			},
		});
	}

	static async findById(locationId: string) {
		return prisma.location.findUnique({
			where: { locationId },
			select: adminLocationSelect,
		});
	}

	static async findActiveById(locationId: string) {
		return prisma.location.findFirst({
			where: {
				locationId,
				isActive: true,
			},
			select: adminLocationSelect,
		});
	}

	static async findAdminLocations(query: AdminGetLocationsQuery) {
		const where: Prisma.LocationWhereInput = buildLocationWhereInput(query);

		const orderBy = mapAdminLocationSort(query.sortBy);
		const skip = (query.page - 1) * query.limit;

		const [items, totalItems] = await prisma.$transaction([
			prisma.location.findMany({
				where,
				orderBy,
				skip,
				take: query.limit,
				select: adminLocationSelect,
			}),
			prisma.location.count({ where }),
		]);

		return { items, totalItems };
	}

	static async findPublicLocations(query: PublicGetLocationsQuery) {
		const where: Prisma.LocationWhereInput = {
			...buildLocationWhereInput(query),
			isActive: true,
		};
		const orderBy = mapAdminLocationSort(query.sortBy);
		const skip = (query.page - 1) * query.limit;

		const [items, totalItems] = await prisma.$transaction([
			prisma.location.findMany({
				where,
				orderBy,
				skip,
				take: query.limit,
				select: adminLocationSelect,
			}),
			prisma.location.count({ where }),
		]);

		return { items, totalItems };
	}

	static async getLocationSummary() {
		const [totalLocations, totalActiveLocations, totalInactiveLocations] =
			await prisma.$transaction([
				prisma.location.count(),
				prisma.location.count({ where: { isActive: true } }),
				prisma.location.count({ where: { isActive: false } }),
			]);

		return {
			totalLocations,
			totalActiveLocations,
			totalInactiveLocations,
		};
	}

	static async createLocation(payload: Prisma.LocationCreateInput) {
		return prisma.location.create({
			data: payload,
			select: adminLocationSelect,
		});
	}

	static async updateLocationById(
		locationId: string,
		payload: Prisma.LocationUpdateInput,
	) {
		return prisma.location.update({
			where: { locationId },
			data: payload,
			select: adminLocationSelect,
		});
	}

	static async deleteLocationById(locationId: string) {
		return prisma.location.delete({
			where: { locationId },
			select: adminLocationSelect,
		});
	}

	static async countLocationUsage(locationId: string) {
		const [placesCount, itinerariesCount] = await prisma.$transaction([
			prisma.place.count({ where: { locationId } }),
			prisma.itinerary.count({ where: { locationId } }),
		]);

		return { placesCount, itinerariesCount };
	}
}

function buildLocationWhereInput(
	query: Pick<AdminGetLocationsQuery, "search" | "provinceName"> & {
		status?: AdminGetLocationsQuery["status"];
	},
): Prisma.LocationWhereInput {
	return {
		...(query.search
			? {
					locationName: {
						contains: query.search,
						mode: "insensitive",
					},
			  }
			: {}),
		...(query.provinceName
			? {
					provinceName: {
						equals: query.provinceName,
						mode: "insensitive",
					},
			  }
			: {}),
		...(query.status ? { isActive: query.status === "active" } : {}),
	};
}

function mapAdminLocationSort(
	sortBy: AdminGetLocationsQuery["sortBy"] | PublicGetLocationsQuery["sortBy"],
): Prisma.LocationOrderByWithRelationInput {
	switch (sortBy) {
		case "nameAsc":
			return { locationName: "asc" };
		case "nameDesc":
			return { locationName: "desc" };
		case "createdAtAsc":
			return { createdAt: "asc" };
		case "createdAtDesc":
		default:
			return { createdAt: "desc" };
	}
}

export default LocationRepository;
