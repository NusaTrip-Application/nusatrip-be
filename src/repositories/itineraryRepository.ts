import { VisibilityStatus } from "../../generated/prisma/enums";
import { Prisma } from "../../generated/prisma/client";
import { prisma } from "../config/prisma";
import type { AdminGetItinerariesQuery, GetMyItinerariesQuery } from "../types/itineraryType";

const itineraryListSelect = {
	itineraryId: true,
	userId: true,
	locationId: true,
	title: true,
	description: true,
	bannerImageUrl: true,
	startDate: true,
	endDate: true,
	travelerCount: true,
	budgetPreference: true,
	visibilityStatus: true,
	estimatedTotalBudget: true,
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
	user: {
		select: {
			userId: true,
			fullName: true,
			email: true,
			profilePhotoUrl: true,
		},
	},
	interestCategories: {
		select: {
			category: {
				select: {
					categoryId: true,
					categoryName: true,
				},
			},
		},
	},
	_count: {
		select: {
			items: true,
			savedReferences: true,
		},
	},
} as const;

const itineraryDetailSelect = {
	itineraryId: true,
	userId: true,
	locationId: true,
	title: true,
	description: true,
	bannerImageUrl: true,
	startDate: true,
	endDate: true,
	travelerCount: true,
	budgetPreference: true,
	visibilityStatus: true,
	estimatedTotalBudget: true,
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
	user: {
		select: {
			userId: true,
			fullName: true,
			profilePhotoUrl: true,
		},
	},
	interestCategories: {
		select: {
			category: {
				select: {
					categoryId: true,
					categoryName: true,
				},
			},
		},
	},
	items: {
		select: {
			itineraryItemId: true,
			visitDate: true,
			visitTime: true,
			notes: true,
			place: {
				select: {
					placeId: true,
					placeName: true,
					shortDescription: true,
					address: true,
					priceMin: true,
					priceMax: true,
					priceDescription: true,
					ratingValue: true,
					images: {
						orderBy: {
							displayOrder: "asc",
						},
						take: 1,
						select: {
							placeImageId: true,
							imageUrl: true,
							displayOrder: true,
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
				},
			},
		},
		orderBy: [
			{ visitDate: "asc" },
			{ visitTime: "asc" },
		] as Prisma.ItineraryItemOrderByWithRelationInput[],
	},
} as const;

const itineraryItemSelect = {
	itineraryItemId: true,
	itineraryId: true,
	placeId: true,
	visitDate: true,
	visitTime: true,
	notes: true,
	createdAt: true,
	updatedAt: true,
	place: {
		select: {
			placeId: true,
			placeName: true,
			shortDescription: true,
			address: true,
			priceMin: true,
			priceMax: true,
			priceDescription: true,
			ratingValue: true,
			images: {
				orderBy: {
					displayOrder: "asc",
				},
				take: 1,
				select: {
					placeImageId: true,
					imageUrl: true,
					displayOrder: true,
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
		},
	},
} as const;

class ItineraryRepository {
	static async createItinerary(
		payload: Prisma.ItineraryCreateInput,
		interestCategoryIds: string[] = [],
	) {
		return prisma.$transaction(async (tx) => {
			const itinerary = await tx.itinerary.create({
				data: payload,
				select: {
					itineraryId: true,
				},
			});

			if (interestCategoryIds.length > 0) {
				await tx.itineraryInterestCategory.createMany({
					data: interestCategoryIds.map((categoryId) => ({
						itineraryId: itinerary.itineraryId,
						categoryId,
					})),
				});
			}

			return tx.itinerary.findUnique({
				where: { itineraryId: itinerary.itineraryId },
				select: itineraryDetailSelect,
			});
		});
	}

	static async findById(itineraryId: string) {
		return prisma.itinerary.findUnique({
			where: { itineraryId },
			select: itineraryDetailSelect,
		});
	}

	static async updateItineraryById(
		itineraryId: string,
		payload: Prisma.ItineraryUpdateInput,
		interestCategoryIds?: string[],
	) {
		return prisma.$transaction(async (tx) => {
			await tx.itinerary.update({
				where: { itineraryId },
				data: payload,
				select: {
					itineraryId: true,
				},
			});

			if (interestCategoryIds !== undefined) {
				await tx.itineraryInterestCategory.deleteMany({
					where: { itineraryId },
				});

				if (interestCategoryIds.length > 0) {
					await tx.itineraryInterestCategory.createMany({
						data: interestCategoryIds.map((categoryId) => ({
							itineraryId,
							categoryId,
						})),
					});
				}
			}

			return tx.itinerary.findUnique({
				where: { itineraryId },
				select: itineraryDetailSelect,
			});
		});
	}

	static async deleteItineraryById(itineraryId: string) {
		return prisma.$transaction(async (tx) => {
			await tx.itineraryItem.deleteMany({ where: { itineraryId } });
			await tx.publishedItineraryReview.deleteMany({ where: { itineraryId } });
			await tx.savedReference.deleteMany({ where: { itineraryId } });
			await tx.duplicatedItineraryLineage.deleteMany({
				where: {
					OR: [{ sourceItineraryId: itineraryId }, { newItineraryId: itineraryId }],
				},
			});

			return tx.itinerary.delete({
				where: { itineraryId },
				select: itineraryDetailSelect,
			});
		});
	}

	static async createItineraryItem(payload: Prisma.ItineraryItemCreateInput) {
		return prisma.itineraryItem.create({
			data: payload,
			select: itineraryItemSelect,
		});
	}

	static async findItineraryItemById(itineraryItemId: string) {
		return prisma.itineraryItem.findUnique({
			where: { itineraryItemId },
			select: itineraryItemSelect,
		});
	}

	static async findItineraryItemSchedule(
		itineraryId: string,
		visitDate: Date,
		visitTime: Date,
		excludedItineraryItemId?: string,
	) {
		return prisma.itineraryItem.findFirst({
			where: {
				itineraryId,
				visitDate,
				visitTime,
				...(excludedItineraryItemId
					? {
							NOT: {
								itineraryItemId: excludedItineraryItemId,
							},
						}
					: {}),
			},
			select: {
				itineraryItemId: true,
			},
		});
	}

	static async updateItineraryItemById(
		itineraryItemId: string,
		payload: Prisma.ItineraryItemUpdateInput,
	) {
		return prisma.itineraryItem.update({
			where: { itineraryItemId },
			data: payload,
			select: itineraryItemSelect,
		});
	}

	static async deleteItineraryItemById(itineraryItemId: string) {
		return prisma.itineraryItem.delete({
			where: { itineraryItemId },
			select: itineraryItemSelect,
		});
	}

	static async findMyItineraries(userId: string, query: GetMyItinerariesQuery) {
		const where = buildItineraryWhereInput({
			userId,
			...(query.locationId ? { locationId: query.locationId } : {}),
			...(query.status ? { status: query.status } : {}),
			...(query.search ? { search: query.search } : {}),
		});

		return prisma.itinerary.findMany({
			where,
			select: itineraryListSelect,
		});
	}

	static async findItineraryDetailById(itineraryId: string) {
		return prisma.itinerary.findUnique({
			where: { itineraryId },
			select: itineraryDetailSelect,
		});
	}

	static async findAdminItineraries(query: AdminGetItinerariesQuery) {
		const where = buildItineraryWhereInput({
			...(query.locationId ? { locationId: query.locationId } : {}),
			...(query.status ? { status: query.status } : {}),
			...(query.search ? { search: query.search } : {}),
		});

		return prisma.itinerary.findMany({
			where,
			select: itineraryListSelect,
		});
	}

	static async findItineraryRatingStatsByIds(itineraryIds: string[]) {
		if (itineraryIds.length === 0) {
			return [];
		}

		return prisma.publishedItineraryReview.groupBy({
			by: ["itineraryId"],
			where: {
				itineraryId: {
					in: itineraryIds,
				},
			},
			_avg: {
				rating: true,
			},
			_count: {
				rating: true,
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

	static async getItinerarySummary() {
		const result = await prisma.itinerary.groupBy({
			by: ["visibilityStatus"],
			_count: {
				itineraryId: true,
			},
		});

		const summary = {
			totalPublished: 0,
			totalPrivate: 0,
			total: 0,
		};

		result.forEach((item: any) => {
			if (item.visibilityStatus === "PUBLISHED") {
				summary.totalPublished = item._count.itineraryId;
			} else if (item.visibilityStatus === "PRIVATE") {
				summary.totalPrivate = item._count.itineraryId;
			}
			summary.total += item._count.itineraryId;
		});

		return summary;
	}

	static async duplicateItinerary(
		sourceItinerary: Prisma.ItineraryGetPayload<{
			include: { items: true; interestCategories: true };
		}>,
		newUserId: string,
	) {
		return prisma.$transaction(async (tx) => {
			const newItinerary = await tx.itinerary.create({
				data: {
					userId: newUserId,
					locationId: sourceItinerary.locationId,
					title: `Copy of ${sourceItinerary.title}`,
					description: sourceItinerary.description,
					bannerImageUrl: sourceItinerary.bannerImageUrl,
					startDate: sourceItinerary.startDate,
					endDate: sourceItinerary.endDate,
					travelerCount: sourceItinerary.travelerCount,
					budgetPreference: sourceItinerary.budgetPreference,
					visibilityStatus: VisibilityStatus.PRIVATE,
					estimatedTotalBudget: sourceItinerary.estimatedTotalBudget,
				},
			});

			if (sourceItinerary.interestCategories.length > 0) {
				await tx.itineraryInterestCategory.createMany({
					data: sourceItinerary.interestCategories.map((ic) => ({
						itineraryId: newItinerary.itineraryId,
						categoryId: ic.categoryId,
					})),
				});
			}

			if (sourceItinerary.items.length > 0) {
				await tx.itineraryItem.createMany({
					data: sourceItinerary.items.map((item) => ({
						itineraryId: newItinerary.itineraryId,
						placeId: item.placeId,
						visitDate: item.visitDate,
						visitTime: item.visitTime,
						notes: item.notes,
					})),
				});
			}

			await tx.duplicatedItineraryLineage.create({
				data: {
					sourceItineraryId: sourceItinerary.itineraryId,
					newItineraryId: newItinerary.itineraryId,
					duplicatedByUserId: newUserId,
				},
			});

			return tx.itinerary.findUnique({
				where: { itineraryId: newItinerary.itineraryId },
				select: itineraryDetailSelect,
			});
		});
	}
}

export type ItineraryListItem = Prisma.ItineraryGetPayload<{
	select: typeof itineraryListSelect;
}>;

export type ItineraryDetailItem = Prisma.ItineraryGetPayload<{
	select: typeof itineraryDetailSelect;
}>;

export type ItineraryItemDetail = Prisma.ItineraryItemGetPayload<{
	select: typeof itineraryItemSelect;
}>;

function buildItineraryWhereInput(query: {
	userId?: string;
	locationId?: string;
	status?: VisibilityStatus;
	search?: string;
}): Prisma.ItineraryWhereInput {
	return {
		...(query.userId ? { userId: query.userId } : {}),
		...(query.locationId ? { locationId: query.locationId } : {}),
		...(query.status ? { visibilityStatus: query.status } : {}),
		...(query.search
			? {
					OR: [
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
					],
				}
			: {}),
	};
}

export default ItineraryRepository;
