import { z } from "zod";

export const createPresignedUrlSchema = z.object({
	mimetype: z
		.string()
		.min(1, "Mimetype is required")
		.min(2, "Mimetype must be at least 2 characters")
		.max(100, "Mimetype must not exceed 100 characters"),
	size: z.coerce
		.number()
		.int("Size must be an integer")
		.min(1, "Size is required")
		.positive("Size must be greater than 0"),
	folder: z.enum(["location", "place", "user", "itinerary"], {
		message: "Invalid folder type. Must be 'location', 'place', 'itinerary' or 'user'",
	}),
});

export const deleteMediaSchema = z.object({
	fileKey: z.string().trim().min(1, "fileKey is required"),
});
