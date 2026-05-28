import { VisibilityStatus } from "../../generated/prisma/enums";
import { z } from "zod";

const uuidMessage = "Invalid itinerary id";
const locationUuidMessage = "Invalid location id";
const categoryUuidMessage = "Invalid category id";
const placeUuidMessage = "Invalid place id";
const itineraryItemUuidMessage = "Invalid itinerary item id";

const visibilityStatusSchema = z.nativeEnum(VisibilityStatus);
const interestCategoryIdsSchema = z.array(z.string().uuid(categoryUuidMessage));
const visitTimeSchema = z
	.string()
	.regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "visit time must be in HH:mm format");

export const getItineraryByIdParamsSchema = z.object({
	itineraryId: z.string().uuid(uuidMessage),
});

export const getItineraryItemParamsSchema = z.object({
	itineraryId: z.string().uuid(uuidMessage),
	itineraryItemId: z.string().uuid(itineraryItemUuidMessage),
});

export const createItinerarySchema = z.object({
	title: z
		.string()
		.trim()
		.min(3, "Title must be at least 3 characters")
		.max(180, "Title must not exceed 180 characters"),
	locationId: z.string().uuid(locationUuidMessage),
	startDate: z.coerce.date(),
	endDate: z.coerce.date(),
	travelerCount: z.coerce.number().int().min(1, "Traveler count must be at least 1"),
	interestSummary: interestCategoryIdsSchema.optional(),
	budgetPreference: z.coerce.number().min(0),
}).superRefine((value, ctx) => {
	if (value.endDate < value.startDate) {
		ctx.addIssue({
			code: z.ZodIssueCode.custom,
			path: ["endDate"],
			message: "End date must be greater than or equal to start date",
		});
	}
});

export const updateItinerarySchema = z
	.object({
		title: z
			.string()
			.trim()
			.min(3, "Title must be at least 3 characters")
			.max(180, "Title must not exceed 180 characters")
			.optional(),
		locationId: z.string().uuid(locationUuidMessage).optional(),
		startDate: z.coerce.date().optional(),
		endDate: z.coerce.date().optional(),
		travelerCount: z.coerce.number().int().min(1, "Traveler count must be at least 1").optional(),
		interestSummary: interestCategoryIdsSchema.optional(),
		budgetPreference: z.coerce.number().min(0).optional(),
		visibilityStatus: visibilityStatusSchema.optional(),
	})
	.superRefine((value, ctx) => {
		if (Object.keys(value).length === 0) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "At least one field must be provided",
			});
		}

		if (value.startDate && value.endDate && value.endDate < value.startDate) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				path: ["endDate"],
				message: "End date must be greater than or equal to start date",
			});
		}
	});

export const updateBudgetSchema = z.object({
	estimatedTotalBudget: z.coerce.number().min(0, "Estimated total budget must be greater than or equal to 0"),
});

export const createItineraryItemSchema = z.object({
	placeId: z.string().uuid(placeUuidMessage),
	visitDate: z.coerce.date(),
	visitTime: visitTimeSchema,
	notes: z.string().trim().max(1000, "Notes must not exceed 1000 characters").optional().or(z.literal("")),
});

export const updateItineraryItemSchema = z
	.object({
		placeId: z.string().uuid(placeUuidMessage).optional(),
		visitDate: z.coerce.date().optional(),
		visitTime: visitTimeSchema.optional(),
		notes: z.string().trim().max(1000, "Notes must not exceed 1000 characters").optional().or(z.literal("")),
	})
	.superRefine((value, ctx) => {
		if (Object.keys(value).length === 0) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "At least one field must be provided",
			});
		}
	});

export const adminGetItinerariesQuerySchema = z.object({
	locationId: z.string().uuid(locationUuidMessage).optional(),
	status: visibilityStatusSchema.optional(),
	search: z.string().trim().optional(),
	sortBy: z
		.enum([
			"titleAsc",
			"titleDesc",
			"createdAtDesc",
			"createdAtAsc",
			"ratingAsc",
			"ratingDesc",
		])
		.default("createdAtDesc"),
	page: z.coerce.number().int().min(1).default(1),
	limit: z.coerce.number().int().min(1).max(100).default(12),
});

export const getMyItinerariesQuerySchema = z.object({
	locationId: z.string().uuid(locationUuidMessage).optional(),
	status: visibilityStatusSchema.optional(),
	search: z.string().trim().optional(),
	sortBy: z
		.enum([
			"titleAsc",
			"titleDesc",
			"createdAtDesc",
			"createdAtAsc",
			"ratingAsc",
			"ratingDesc",
		])
		.default("createdAtDesc"),
	page: z.coerce.number().int().min(1).default(1),
	limit: z.coerce.number().int().min(1).max(100).default(12),
});
