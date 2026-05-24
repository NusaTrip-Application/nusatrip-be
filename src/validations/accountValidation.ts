import { AccountStatus } from "../../generated/prisma/enums";
import { z } from "zod";

const uuidMessage = "Invalid user id";

export const registerAccountSchema = z.object({
	fullName: z
		.string()
		.trim()
		.min(3, "Fullname must be at least 3 characters")
		.max(150, "Fullname must not exceed 150 characters"),
	email: z
		.string()
		.trim()
		.toLowerCase()
		.email("Email must be a valid email address"),
	password: z
		.string()
		.min(8, "Password must be at least 8 characters long")
		.max(100, "Password must not exceed 100 characters"),
});

export const updateAccountSchema = z
	.object({
		fullName: z
			.string()
			.trim()
			.min(3, "Fullname must be at least 3 characters")
			.max(150, "FullName must not exceed 150 characters")
			.optional(),
		email: z
			.string()
			.trim()
			.toLowerCase()
			.email("Email must be a valid email address")
			.optional(),
		password: z
			.string()
			.min(8, "Password must be at least 8 characters long")
			.max(100, "Password must not exceed 100 characters")
			.optional(),
		phoneNumber: z
			.string()
			.trim()
			.min(8, "Phone number must be at least 8 characters")
			.max(30, "Phone number must not exceed 30 characters")
			.optional()
			.or(z.literal("")),
		instagramUsername: z
			.string()
			.trim()
			.min(3, "Instagram username must be at least 3 characters")
			.max(100, "Instagram username must not exceed 100 characters")
			.optional()
			.or(z.literal("")),
		profilePhotoUrl: z
			.string()
			.url("Profile photo url must be a valid URL")
			.optional()
			.or(z.literal("")),
	})
	.refine((data) => Object.keys(data).length > 0, {
		message: "At least one field must be provided",
	});

export const getAccountByIdParamsSchema = z.object({
	userId: z.string().uuid(uuidMessage),
});

export const adminCreateUserSchema = z.object({
	fullName: z
		.string()
		.trim()
		.min(3, "Fullname must be at least 3 characters")
		.max(150, "Fullname must not exceed 150 characters"),
	email: z
		.string()
		.trim()
		.toLowerCase()
		.email("Email must be a valid email address"),
	password: z
		.string()
		.min(8, "Password must be at least 8 characters long")
		.max(100, "Password must not exceed 100 characters"),
	phoneNumber: z
		.string()
		.trim()
		.min(8, "Phone number must be at least 8 characters")
		.max(30, "Phone number must not exceed 30 characters")
		.optional(),
	instagramUsername: z
		.string()
		.trim()
		.min(3, "Instagram username must be at least 3 characters")
		.max(100, "Instagram username must not exceed 100 characters")
		.optional(),
	profilePhotoUrl: z.string().url("Profile photo url must be a valid URL").optional(),
	accountStatus: z.enum(AccountStatus).optional(),
});

export const changeUserStatusSchema = z.object({
	accountStatus: z.enum(AccountStatus),
});
