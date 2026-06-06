import { DayOfWeek, PlaceCategoryEnum } from "../../generated/prisma/enums";
import { z } from "zod";

const uuidMessage = "Invalid place id";
const locationUuidMessage = "Invalid location id";
const categoryUuidMessage = "Invalid category id";

const categoryEnumSchema = z.nativeEnum(PlaceCategoryEnum);
const dayOfWeekSchema = z.nativeEnum(DayOfWeek);
const categoryIdSchema = z.string().uuid(categoryUuidMessage);

const optionalUrlSchema = z
	.string()
	.url("Value must be a valid URL")
	.optional()
	.or(z.literal(""));

const optionalStringSchema = (label: string, max: number) =>
	z.string().trim().max(max, `${label} must not exceed ${max} characters`).optional().or(z.literal(""));

const imageSchema = z.object({
	imageUrl: z.string(),
	displayOrder: z.coerce.number().int().min(1).default(1),
});

const operatingHourSchema = z
	.object({
		dayOfWeek: dayOfWeekSchema,
		openTime: z
			.string()
			.regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "openTime must be in HH:mm format")
			.optional(),
		closeTime: z
			.string()
			.regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "closeTime must be in HH:mm format")
			.optional(),
		isClosed: z.boolean().default(false),
	})
	.superRefine((value, ctx) => {
		if (value.isClosed) {
			return;
		}

		if (!value.openTime) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				path: ["openTime"],
				message: "openTime is required when place is open",
			});
		}

		if (!value.closeTime) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				path: ["closeTime"],
				message: "closeTime is required when place is open",
			});
		}
	});

const basePlaceSchema = z.object({
	locationId: z.string().uuid(locationUuidMessage),
	placeName: z
		.string()
		.trim()
		.min(3, "Place name must be at least 3 characters")
		.max(180, "Place name must not exceed 180 characters"),
	categories: z.array(categoryIdSchema).min(1, "At least one category is required"),
	shortDescription: optionalStringSchema("Short description", 1000),
	address: z
		.string()
		.trim()
		.min(5, "Address must be at least 5 characters")
		.max(500, "Address must not exceed 500 characters"),
	priceMin: z.coerce.number().min(0, "priceMin must be greater than or equal to 0").optional(),
	priceMax: z.coerce.number().min(0, "priceMax must be greater than or equal to 0").optional(),
	priceDescription: optionalStringSchema("Price description", 100),
	websiteUrl: optionalUrlSchema,
	contactPhoneNumber: optionalStringSchema("Contact phone number", 50),
	ratingValue: z.coerce.number().min(0).max(5).optional(),
	ratingCount: z.coerce.number().int().min(0).optional(),
	operatingHours: z.array(operatingHourSchema).min(1, "At least one operating hour is required"),
	images: z.array(imageSchema).min(0).optional(),
}).superRefine((value, ctx) => {
	validatePriceRange(value.priceMin, value.priceMax, ctx);
});

export const getPlaceByIdParamsSchema = z.object({
	placeId: z.string().uuid(uuidMessage),
});

export const createPlaceSchema = basePlaceSchema.superRefine((value, ctx) => {
	validateUniqueCollections(value, ctx);
});

export const updatePlaceSchema = z
	.object({
		locationId: z.string().uuid(locationUuidMessage).optional(),
		placeName: z
			.string()
			.trim()
			.min(3, "Place name must be at least 3 characters")
			.max(180, "Place name must not exceed 180 characters")
			.optional(),
		categories: z.array(categoryIdSchema).min(1, "At least one category is required").optional(),
		shortDescription: optionalStringSchema("Short description", 1000),
		address: z
			.string()
			.trim()
			.min(5, "Address must be at least 5 characters")
			.max(500, "Address must not exceed 500 characters")
			.optional(),
		priceMin: z.coerce.number().min(0, "priceMin must be greater than or equal to 0").optional(),
		priceMax: z.coerce.number().min(0, "priceMax must be greater than or equal to 0").optional(),
		priceDescription: optionalStringSchema("Price description", 100),
		websiteUrl: optionalUrlSchema,
		contactPhoneNumber: optionalStringSchema("Contact phone number", 50),
		ratingValue: z.coerce.number().min(0).max(5).optional(),
		ratingCount: z.coerce.number().int().min(0).optional(),
		operatingHours: z.array(operatingHourSchema).min(1, "At least one operating hour is required").optional(),
		images: z.array(imageSchema).min(0).optional(),
		isActive: z.boolean().optional(),
	})
	.superRefine((value, ctx) => {
		if (Object.keys(value).length === 0) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "At least one field must be provided",
			});
		}

		validateUniqueCollections(value, ctx);
		validatePriceRange(value.priceMin, value.priceMax, ctx);
	});

export const adminGetPlacesQuerySchema = z.object({
	locationId: z.string().uuid(locationUuidMessage).optional(),
	categories: z
		.preprocess(normalizeArrayInput, z.array(categoryEnumSchema).min(1).optional())
		.optional(),
	status: z.enum(["active", "inactive"]).optional(),
	search: z.string().trim().optional(),
	sortBy: z
		.enum([
			"nameAsc",
			"nameDesc",
			"createdAtDesc",
			"createdAtAsc",
			"ratingAsc",
			"ratingDesc",
		])
		.default("createdAtDesc"),
	page: z.coerce.number().int().min(1).default(1),
	limit: z.coerce.number().int().min(1).max(100).default(12),
});

export const getPlaceRecommendationsQuerySchema = z.object({
	locationId: z.string().uuid(locationUuidMessage).optional(),
	categories: z.preprocess(normalizeArrayInput, z.array(categoryEnumSchema).min(1).optional()).optional(),
	budgetPreference: z.coerce.number().positive().optional(),
	limit: z.coerce.number().int().min(1).max(50).default(12),
	page: z.coerce.number().int().min(1).default(1),
});

function normalizeArrayInput(value: unknown) {
	if (typeof value === "string") {
		return value
			.split(",")
			.map((item) => item.trim())
			.filter(Boolean);
	}

	return value;
}

function validateUniqueCollections(
	value: {
		categories?: string[] | undefined;
		images?: Array<{ displayOrder: number }> | undefined;
		operatingHours?: Array<{ dayOfWeek: DayOfWeek }> | undefined;
	},
	ctx: z.RefinementCtx,
) {
	if (value.categories) {
		const uniqueCategories = new Set(value.categories);
		if (uniqueCategories.size !== value.categories.length) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				path: ["categories"],
				message: "Categories must be unique",
			});
		}
	}

	if (value.images) {
		const displayOrders = value.images.map((image) => image.displayOrder);
		if (new Set(displayOrders).size !== displayOrders.length) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				path: ["images"],
				message: "Image displayOrder values must be unique",
			});
		}
	}

	if (value.operatingHours) {
		const days = value.operatingHours.map((item) => item.dayOfWeek);
		if (new Set(days).size !== days.length) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				path: ["operatingHours"],
				message: "Operating hours must contain unique dayOfWeek values",
			});
		}
	}
}

function validatePriceRange(
	priceMin: number | undefined,
	priceMax: number | undefined,
	ctx: z.RefinementCtx,
) {
	if (
		priceMin !== undefined &&
		priceMax !== undefined &&
		priceMax < priceMin
	) {
		ctx.addIssue({
			code: z.ZodIssueCode.custom,
			path: ["priceMax"],
			message: "priceMax must be greater than or equal to priceMin",
		});
	}
}
