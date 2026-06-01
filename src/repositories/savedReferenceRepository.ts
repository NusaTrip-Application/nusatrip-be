import { prisma } from "../config/prisma";
import { VisibilityStatus } from "../../generated/prisma/enums";
import type { GetSavedItinerariesQuery } from "../types/communityType";

class SavedReferenceRepository {
	static async findByUserAndItinerary(userId: string, itineraryId: string) {
		return prisma.savedReference.findUnique({
			where: {
				userId_itineraryId: {
					userId,
					itineraryId,
				},
			},
		});
	}

	static async createSavedItinerary(userId: string, itineraryId: string) {
		return prisma.savedReference.create({
			data: {
				userId,
				itineraryId,
			},
		});
	}

	static async findSavedItineraries(
		userId: string,
		query: GetSavedItinerariesQuery,
	) {
		const skip = (query.page - 1) * query.limit;

		const [items, totalItems] = await prisma.$transaction([
			prisma.savedReference.findMany({
				where: {
					userId,
					itinerary: {
						visibilityStatus: VisibilityStatus.PUBLISHED,
					},
				},
				include: {
					itinerary: {
						include: {
							location: true,
							user: {
								select: {
									userId: true,
									fullName: true,
									profilePhotoUrl: true,
								},
							},
							_count: {
								select: {
									reviews: true,
									savedReferences: true,
									items: true,
								},
							},
						},
					},
				},
				orderBy: { savedAt: "desc" },
				skip,
				take: query.limit,
			}),
			prisma.savedReference.count({
				where: {
					userId,
					itinerary: {
						visibilityStatus: VisibilityStatus.PUBLISHED,
					},
				},
			}),
		]);

		return { items, totalItems };
	}
}

export default SavedReferenceRepository;
