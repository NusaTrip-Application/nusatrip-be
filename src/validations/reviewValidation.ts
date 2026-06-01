import { z } from "zod";

const reviewUuidMessage = "Invalid review id";
const itineraryUuidMessage = "Invalid itinerary id";

const ratingSchema = z.coerce
	.number()
	.min(1, "Rating must be at least 1")
	.max(5, "Rating must not exceed 5");

export const getReviewByIdParamsSchema = z.object({
	reviewId: z.string().uuid(reviewUuidMessage),
});

export const getReviewByItineraryParamsSchema = z.object({
	itineraryId: z.string().uuid(itineraryUuidMessage),
});

export const createReviewSchema = z.object({
	rating: ratingSchema,
	comment: z
		.string()
		.trim()
		.max(1000, "Comment must not exceed 1000 characters")
		.optional()
		.or(z.literal("")),
});

export const updateReviewSchema = z
	.object({
		rating: ratingSchema.optional(),
		comment: z
			.string()
			.trim()
			.max(1000, "Comment must not exceed 1000 characters")
			.optional()
			.or(z.literal("")),
	})
	.superRefine((value, ctx) => {
		if (Object.keys(value).length === 0) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "At least one field must be provided",
			});
		}
	});

export const publicGetReviewsQuerySchema = z.object({
	itineraryId: z.string().uuid(itineraryUuidMessage).optional(),
	rating: ratingSchema.optional(),
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

export const adminGetReviewsQuerySchema = publicGetReviewsQuerySchema.extend({
	status: z.enum(["active", "inactive"]).optional(),
});
