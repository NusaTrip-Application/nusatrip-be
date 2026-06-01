import { z } from "zod";
import {
	adminGetReviewsQuerySchema,
	createReviewSchema,
	getReviewByIdParamsSchema,
	getReviewByItineraryParamsSchema,
	publicGetReviewsQuerySchema,
	updateReviewSchema,
} from "../validations/reviewValidation";

export type GetReviewByIdParams = z.infer<typeof getReviewByIdParamsSchema>;
export type GetReviewByItineraryParams = z.infer<
	typeof getReviewByItineraryParamsSchema
>;
export type CreateReviewPayload = z.infer<typeof createReviewSchema>;
export type UpdateReviewPayload = z.infer<typeof updateReviewSchema>;
export type PublicGetReviewsQuery = z.infer<typeof publicGetReviewsQuerySchema>;
export type AdminGetReviewsQuery = z.infer<typeof adminGetReviewsQuerySchema>;
