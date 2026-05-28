import type { Prisma } from "../../generated/prisma/client";
import { prisma } from "../config/prisma";
import type {
	AdminGetLocationsQuery,
	PublicGetLocationsQuery,
} from "../types/locationType";

const adminLocationSelect = {
	locationId: true,
	locationName: true,
	provinceId: true,
	description: true,
	imageUrl: true,
	isActive: true,
	createdAt: true,
	updatedAt: true,
	province: {
		select: {
			provinceId: true,
			provinceName: true,
			isActive: true,
		},
	},
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

	static async findProvinceById(provinceId: string) {
		return prisma.province.findUnique({
			where: { provinceId },
		});
	}

	static async findActiveProvinces() {
		return prisma.province.findMany({
			where: {
				isActive: true,
			},
			orderBy: [{ order: "asc" }, { provinceName: "asc" }],
			select: {
				provinceId: true,
				provinceName: true,
				order: true,
			},
		});
	}

	static async findActiveLocationOptions() {
		return prisma.location.findMany({
			where: {
				isActive: true,
			},
			orderBy: [{ locationName: "asc" }],
			select: {
				locationId: true,
				locationName: true,
			},
		});
	}

	static async findActiveProvinceById(provinceId: string) {
		return prisma.province.findFirst({
			where: {
				provinceId,
				isActive: true,
			},
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
	query: Pick<AdminGetLocationsQuery, "search" | "provinceId"> & {
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
		...(query.provinceId
			? {
					provinceId: query.provinceId,
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
