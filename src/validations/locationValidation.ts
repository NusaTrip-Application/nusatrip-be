import { z } from "zod";

const uuidMessage = "Invalid location id";
const provinceUuidMessage = "Invalid province id";

export const getLocationByIdParamsSchema = z.object({
	locationId: z.string().uuid(uuidMessage),
});

export const adminGetLocationsQuerySchema = z.object({
	search: z.string().trim().optional(),
	provinceId: z.string().uuid(provinceUuidMessage).optional(),
	status: z.enum(["active", "inactive"]).optional(),
	sortBy: z
		.enum(["nameAsc", "nameDesc", "createdAtAsc", "createdAtDesc"])
		.default("createdAtDesc"),
	page: z.coerce.number().int().min(1).default(1),
	limit: z.coerce.number().int().min(1).max(100).default(12),
});

export const publicGetLocationsQuerySchema = z.object({
	search: z.string().trim().optional(),
	provinceId: z.string().uuid(provinceUuidMessage).optional(),
	sortBy: z
		.enum(["nameAsc", "nameDesc", "createdAtAsc", "createdAtDesc"])
		.default("nameAsc"),
	page: z.coerce.number().int().min(1).default(1),
	limit: z.coerce.number().int().min(1).max(100).default(12),
});

export const createLocationSchema = z.object({
	provinceId: z.string().uuid(provinceUuidMessage),
	locationName: z
		.string()
		.trim()
		.min(3, "Location name must be at least 3 characters")
		.max(120, "Location name must not exceed 120 characters"),
	description: z
		.string()
		.trim()
		.max(1000, "Description must not exceed 1000 characters")
		.optional()
		.or(z.literal("")),
	imageUrl: z
		.string()
		.optional()
		.or(z.literal("")),
	isActive: z.boolean().default(true),
});

export const updateLocationSchema = z
	.object({
		provinceId: z.string().uuid(provinceUuidMessage).optional(),
		locationName: z
			.string()
			.trim()
			.min(3, "Location name must be at least 3 characters")
			.max(120, "Location name must not exceed 120 characters")
			.optional(),
		description: z
			.string()
			.trim()
			.max(1000, "Description must not exceed 1000 characters")
			.optional()
			.or(z.literal("")),
		imageUrl: z
			.string()
			.optional()
			.or(z.literal("")),
		isActive: z.boolean().optional(),
	})
	.refine((data) => Object.keys(data).length > 0, {
		message: "At least one field must be provided",
	});

export const changeLocationStatusSchema = z.object({
	isActive: z.boolean(),
});
