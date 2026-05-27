import { PlaceCategoryEnum } from "../../generated/prisma/enums";
import type { Prisma } from "../../generated/prisma/client";
import { prisma } from "../config/prisma";
import type {
	AdminGetPlacesQuery,
	GetPlaceRecommendationsQuery,
} from "../types/placeType";

const adminPlaceListSelect = {
	placeId: true,
	placeName: true,
	shortDescription: true,
	address: true,
	priceMin: true,
	priceMax: true,
	priceDescription: true,
	websiteUrl: true,
	contactPhoneNumber: true,
	ratingValue: true,
	ratingCount: true,
	isActive: true,
	createdAt: true,
	updatedAt: true,
	location: {
		select: {
			locationId: true,
			locationName: true,
			province: {
				select: {
					provinceId: true,
					provinceName: true,
				},
			},
		},
	},
	categoryMappings: {
		select: {
			category: {
				select: {
					categoryName: true,
				},
			},
		},
	},
	images: {
		orderBy: {
			displayOrder: "asc",
		},
		select: {
			placeImageId: true,
			imageUrl: true,
			displayOrder: true,
		},
	},
} as const;

const placeDetailSelect = {
	placeId: true,
	locationId: true,
	placeName: true,
	shortDescription: true,
	address: true,
	priceMin: true,
	priceMax: true,
	priceDescription: true,
	websiteUrl: true,
	contactPhoneNumber: true,
	ratingValue: true,
	ratingCount: true,
	isActive: true,
	createdAt: true,
	updatedAt: true,
	location: {
		select: {
			locationId: true,
			locationName: true,
			isActive: true,
			province: {
				select: {
					provinceId: true,
					provinceName: true,
					isActive: true,
				},
			},
		},
	},
	categoryMappings: {
		select: {
			category: {
				select: {
					categoryId: true,
					categoryName: true,
				},
			},
		},
	},
	operatingHours: {
		orderBy: {
			dayOfWeek: "asc",
		},
		select: {
			operatingHourId: true,
			dayOfWeek: true,
			openTime: true,
			closeTime: true,
			isClosed: true,
		},
	},
	images: {
		orderBy: {
			displayOrder: "asc",
		},
		select: {
			placeImageId: true,
			imageUrl: true,
			displayOrder: true,
		},
	},
} as const;

const recommendationSelect = {
	placeId: true,
	placeName: true,
	shortDescription: true,
	address: true,
	priceMin: true,
	priceMax: true,
	priceDescription: true,
	ratingValue: true,
	ratingCount: true,
	location: {
		select: {
			locationId: true,
			locationName: true,
			province: {
				select: {
					provinceId: true,
					provinceName: true,
				},
			},
		},
	},
	categoryMappings: {
		select: {
			category: {
				select: {
					categoryName: true,
				},
			},
		},
	},
	images: {
		orderBy: {
			displayOrder: "asc",
		},
		select: {
			placeImageId: true,
			imageUrl: true,
			displayOrder: true,
		},
		take: 1,
	},
} as const;

class PlaceRepository {
	static async findActiveCategories() {
		return prisma.placeCategory.findMany({
			where: { isActive: true },
			orderBy: { categoryName: "asc" },
			select: {
				categoryId: true,
				categoryName: true,
			},
		});
	}

	static async findActiveCategoriesByIds(categoryIds: string[]) {
		return prisma.placeCategory.findMany({
			where: {
				categoryId: {
					in: categoryIds,
				},
				isActive: true,
			},
			select: {
				categoryId: true,
			},
		});
	}

	static async findById(placeId: string) {
		return prisma.place.findUnique({
			where: { placeId },
			select: placeDetailSelect,
		});
	}

	static async findActiveById(placeId: string) {
		return prisma.place.findFirst({
			where: {
				placeId,
				isActive: true,
				location: {
					isActive: true,
				},
			},
			select: placeDetailSelect,
		});
	}

	static async createPlace(payload: Prisma.PlaceCreateInput) {
		return prisma.place.create({
			data: payload,
			select: placeDetailSelect,
		});
	}

	static async updatePlaceById(
		placeId: string,
		payload: Prisma.PlaceUpdateInput,
	) {
		return prisma.place.update({
			where: { placeId },
			data: payload,
			select: placeDetailSelect,
		});
	}

	static async deletePlaceById(placeId: string) {
		return prisma.$transaction(async (tx) => {
			await tx.placeImage.deleteMany({ where: { placeId } });
			await tx.placeOperatingHour.deleteMany({ where: { placeId } });
			await tx.placeCategoryMapping.deleteMany({ where: { placeId } });

			return tx.place.delete({
				where: { placeId },
				select: placeDetailSelect,
			});
		});
	}

	static async countPlaceUsage(placeId: string) {
		return prisma.itineraryItem.count({
			where: { placeId },
		});
	}

	static async findAdminPlaces(query: AdminGetPlacesQuery) {
		const where = buildAdminPlaceWhereInput(query);
		const orderBy = mapAdminPlaceSort(query.sortBy);
		const skip = (query.page - 1) * query.limit;

		const [items, totalItems] = await prisma.$transaction([
			prisma.place.findMany({
				where,
				orderBy,
				skip,
				take: query.limit,
				select: adminPlaceListSelect,
			}),
			prisma.place.count({ where }),
		]);

		return { items, totalItems };
	}

	static async getPlaceSummary() {
		const [totalPlaces, totalActivePlaces, totalInactivePlaces, aggregates] =
			await prisma.$transaction([
				prisma.place.count(),
				prisma.place.count({ where: { isActive: true } }),
				prisma.place.count({ where: { isActive: false } }),
				prisma.place.aggregate({
					_avg: {
						ratingValue: true,
					},
				}),
			]);

		return {
			totalPlaces,
			totalActivePlaces,
			totalInactivePlaces,
			averageRating: Number(aggregates._avg.ratingValue ?? 0),
		};
	}

	static async findRecommendedPlaces(query: GetPlaceRecommendationsQuery) {
		const where: Prisma.PlaceWhereInput = {
			isActive: true,
			location: {
				isActive: true,
			},
			...(query.locationId ? { locationId: query.locationId } : {}),
		};

		return prisma.place.findMany({
			where,
			select: recommendationSelect,
		});
	}
}

function buildAdminPlaceWhereInput(
	query: AdminGetPlacesQuery,
): Prisma.PlaceWhereInput {
	return {
		...(query.locationId ? { locationId: query.locationId } : {}),
		...(query.status ? { isActive: query.status === "active" } : {}),
		...(query.search
			? {
					placeName: {
						contains: query.search,
						mode: "insensitive",
					},
				}
			: {}),
		...(query.categories && query.categories.length > 0
			? {
					categoryMappings: {
						some: {
							category: {
								categoryName: {
									in: query.categories,
								},
							},
						},
					},
				}
			: {}),
	};
}

function mapAdminPlaceSort(
	sortBy: AdminGetPlacesQuery["sortBy"],
): Prisma.PlaceOrderByWithRelationInput[] {
	switch (sortBy) {
		case "nameAsc":
			return [{ placeName: "asc" }];
		case "nameDesc":
			return [{ placeName: "desc" }];
		case "createdAtAsc":
			return [{ createdAt: "asc" }];
		case "ratingAsc":
			return [{ ratingValue: "asc" }, { placeName: "asc" }];
		case "ratingDesc":
			return [{ ratingValue: "desc" }, { placeName: "asc" }];
		case "createdAtDesc":
		default:
			return [{ createdAt: "desc" }];
	}
}

export type RecommendationPlace = Prisma.PlaceGetPayload<{
	select: typeof recommendationSelect;
}>;

export type PlaceDetail = Prisma.PlaceGetPayload<{
	select: typeof placeDetailSelect;
}>;

export default PlaceRepository;
