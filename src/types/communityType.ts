import { z } from "zod";
import {
	getCommunityItinerariesQuerySchema,
	getOtherAuthorItinerariesQuerySchema,
	getSavedItinerariesQuerySchema,
} from "../validations/communityValidation";

export type GetCommunityItinerariesQuery = z.infer<
	typeof getCommunityItinerariesQuerySchema
>;

export type GetSavedItinerariesQuery = z.infer<
	typeof getSavedItinerariesQuerySchema
>;

export type GetOtherAuthorItinerariesQuery = z.infer<
	typeof getOtherAuthorItinerariesQuerySchema
>;
