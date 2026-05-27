import {
	adminGetPlacesQuerySchema,
	createPlaceSchema,
	getPlaceByIdParamsSchema,
	getPlaceRecommendationsQuerySchema,
	updatePlaceSchema,
} from "../validations/placeValidation";
import { z } from "zod";

export type GetPlaceByIdParams = z.infer<typeof getPlaceByIdParamsSchema>;
export type CreatePlacePayload = z.infer<typeof createPlaceSchema>;
export type UpdatePlacePayload = z.infer<typeof updatePlaceSchema>;
export type AdminGetPlacesQuery = z.infer<typeof adminGetPlacesQuerySchema>;
export type GetPlaceRecommendationsQuery = z.infer<
	typeof getPlaceRecommendationsQuerySchema
>;
