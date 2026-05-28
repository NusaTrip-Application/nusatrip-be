import { z } from "zod";
import {
	adminGetItinerariesQuerySchema,
	createItineraryItemSchema,
	createItinerarySchema,
	getItineraryByIdParamsSchema,
	getItineraryItemParamsSchema,
	getMyItinerariesQuerySchema,
	updateBudgetSchema,
	updateItineraryItemSchema,
	updateItinerarySchema,
} from "../validations/itineraryValidation";

export type GetItineraryByIdParams = z.infer<typeof getItineraryByIdParamsSchema>;
export type GetItineraryItemParams = z.infer<typeof getItineraryItemParamsSchema>;
export type CreateItineraryPayload = z.infer<typeof createItinerarySchema>;
export type UpdateItineraryPayload = z.infer<typeof updateItinerarySchema>;
export type UpdateBudgetPayload = z.infer<typeof updateBudgetSchema>;
export type CreateItineraryItemPayload = z.infer<typeof createItineraryItemSchema>;
export type UpdateItineraryItemPayload = z.infer<typeof updateItineraryItemSchema>;
export type AdminGetItinerariesQuery = z.infer<typeof adminGetItinerariesQuerySchema>;
export type GetMyItinerariesQuery = z.infer<typeof getMyItinerariesQuerySchema>;
