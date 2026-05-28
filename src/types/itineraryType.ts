import { z } from "zod";
import {
	adminGetItinerariesQuerySchema,
	createItinerarySchema,
	getItineraryByIdParamsSchema,
	getMyItinerariesQuerySchema,
	updateBudgetSchema,
	updateItinerarySchema,
} from "../validations/itineraryValidation";

export type GetItineraryByIdParams = z.infer<typeof getItineraryByIdParamsSchema>;
export type CreateItineraryPayload = z.infer<typeof createItinerarySchema>;
export type UpdateItineraryPayload = z.infer<typeof updateItinerarySchema>;
export type UpdateBudgetPayload = z.infer<typeof updateBudgetSchema>;
export type AdminGetItinerariesQuery = z.infer<typeof adminGetItinerariesQuerySchema>;
export type GetMyItinerariesQuery = z.infer<typeof getMyItinerariesQuerySchema>;
