import { z } from "zod";

export const getCommunityItinerariesQuerySchema = z.object({
	search: z.string().trim().optional(),
	filter: z.enum(["popular", "recent"]).default("recent"),
	page: z.coerce.number().int().min(1).default(1),
	limit: z.coerce.number().int().min(1).max(100).default(12),
});

export const getSavedItinerariesQuerySchema = z.object({
	page: z.coerce.number().int().min(1).default(1),
	limit: z.coerce.number().int().min(1).max(100).default(12),
});

export const getOtherAuthorItinerariesQuerySchema = z.object({
	page: z.coerce.number().int().min(1).default(1),
	limit: z.coerce.number().int().min(1).max(100).default(12),
});
