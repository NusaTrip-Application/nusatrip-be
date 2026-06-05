import swaggerJSDoc = require("swagger-jsdoc");
import { env } from "./env";

const port = env.PORT ?? 8000;

let cachedSpec: object | null = null;

export const getSwaggerSpec = (): object => {
	if (cachedSpec) {
		return cachedSpec;
	}

	cachedSpec = swaggerJSDoc({
		definition: {
			openapi: "3.0.3",
			info: {
				title: "NusaTrip API",
				version: "1.0.0",
				description: "API documentation for NusaTrip backend.",
			},
			servers: [
				{
					url: env.isProduction ? "/" : `http://localhost:${port}`,
				},
			],
			components: {
				securitySchemes: {
					bearerAuth: {
						type: "http",
						scheme: "bearer",
						bearerFormat: "JWT",
					},
				},
				schemas: {
					ApiSuccess: {
						type: "object",
						required: ["success", "message", "data"],
						properties: {
							success: { type: "boolean", example: true },
							message: { type: "string", example: "success" },
							data: { nullable: true },
						},
					},
					ApiError: {
						type: "object",
						required: ["success", "message"],
						properties: {
							success: { type: "boolean", example: false },
							message: { type: "string", example: "Validation error" },
							errors: { nullable: true },
						},
					},
					LoginRequest: {
						type: "object",
						required: ["email", "password"],
						properties: {
							email: {
								type: "string",
								format: "email",
								example: "user@example.com",
							},
							password: { type: "string", minLength: 8, example: "password123" },
						},
					},
					LoginResponse: {
						type: "object",
						required: ["accessToken"],
						properties: {
							accessToken: { type: "string" },
						},
					},
					RegisterAccountRequest: {
						type: "object",
						required: ["fullName", "email", "password"],
						properties: {
							fullName: { type: "string", minLength: 3, maxLength: 150 },
							email: { type: "string", format: "email" },
							password: { type: "string", minLength: 8, maxLength: 100 },
						},
					},
					UpdateAccountRequest: {
						type: "object",
						properties: {
							fullName: { type: "string", minLength: 3, maxLength: 150 },
							email: { type: "string", format: "email" },
							password: { type: "string", minLength: 8, maxLength: 100 },
							phoneNumber: { type: "string" },
							instagramUsername: { type: "string" },
							profilePhotoUrl: { type: "string", format: "uri" },
						},
					},
					AdminCreateUserRequest: {
						type: "object",
						required: ["fullName", "email", "password"],
						properties: {
							fullName: { type: "string" },
							email: { type: "string", format: "email" },
							password: { type: "string", minLength: 8 },
							phoneNumber: { type: "string" },
							instagramUsername: { type: "string" },
							profilePhotoUrl: { type: "string", format: "uri" },
							accountStatus: {
								type: "string",
								description: "AccountStatus enum",
							},
						},
					},
					ChangeUserStatusRequest: {
						type: "object",
						required: ["accountStatus"],
						properties: {
							accountStatus: {
								type: "string",
								description: "AccountStatus enum",
							},
						},
					},
					CreateLocationRequest: {
						type: "object",
						required: ["provinceId", "locationName"],
						properties: {
							provinceId: { type: "string", format: "uuid" },
							locationName: { type: "string", minLength: 3, maxLength: 120 },
							description: { type: "string", nullable: true },
							imageUrl: { type: "string", format: "uri", nullable: true },
						},
					},
					UpdateLocationRequest: {
						type: "object",
						properties: {
							provinceId: { type: "string", format: "uuid" },
							locationName: { type: "string" },
							description: { type: "string", nullable: true },
							imageUrl: { type: "string", format: "uri", nullable: true },
						},
					},
					ChangeLocationStatusRequest: {
						type: "object",
						required: ["isActive"],
						properties: {
							isActive: { type: "boolean" },
						},
					},
					CreatePlaceRequest: {
						type: "object",
						properties: {
							locationId: { type: "string", format: "uuid" },
							placeName: { type: "string" },
							categories: {
								type: "array",
								items: { type: "string", format: "uuid" },
							},
							address: { type: "string" },
							operatingHours: { type: "array", items: { type: "object" } },
							images: {
								type: "array",
								items: { type: "object" },
								nullable: true,
							},
						},
					},
					UpdatePlaceRequest: {
						type: "object",
						properties: {
							locationId: { type: "string", format: "uuid" },
							placeName: { type: "string" },
							categories: {
								type: "array",
								items: { type: "string", format: "uuid" },
							},
							address: { type: "string" },
							operatingHours: {
								type: "array",
								items: { type: "object" },
								nullable: true,
							},
							images: {
								type: "array",
								items: { type: "object" },
								nullable: true,
							},
							isActive: { type: "boolean", nullable: true },
						},
					},
					CreateItineraryRequest: {
						type: "object",
						properties: {
							title: { type: "string" },
							locationId: { type: "string", format: "uuid" },
							startDate: { type: "string", format: "date-time" },
							endDate: { type: "string", format: "date-time" },
							travelerCount: { type: "integer" },
							interestSummary: {
								type: "array",
								items: { type: "string", format: "uuid" },
								nullable: true,
							},
							budgetPreference: { type: "number" },
						},
					},
					UpdateItineraryRequest: {
						type: "object",
						properties: {
							title: { type: "string" },
							locationId: { type: "string", format: "uuid" },
							startDate: { type: "string", format: "date-time" },
							endDate: { type: "string", format: "date-time" },
							travelerCount: { type: "integer" },
							interestSummary: {
								type: "array",
								items: { type: "string", format: "uuid" },
								nullable: true,
							},
							budgetPreference: { type: "number" },
							visibilityStatus: { type: "string" },
						},
					},
					UpdateBudgetRequest: {
						type: "object",
						required: ["estimatedTotalBudget"],
						properties: {
							estimatedTotalBudget: { type: "number", minimum: 0 },
						},
					},
					CreateItineraryItemRequest: {
						type: "object",
						properties: {
							placeId: { type: "string", format: "uuid" },
							visitDate: { type: "string", format: "date-time" },
							visitTime: { type: "string", example: "09:00" },
							notes: { type: "string", nullable: true },
						},
					},
					UpdateItineraryItemRequest: {
						type: "object",
						properties: {
							placeId: { type: "string", format: "uuid" },
							visitDate: { type: "string", format: "date-time" },
							visitTime: { type: "string", example: "09:00" },
							notes: { type: "string", nullable: true },
						},
					},
					CreateReviewRequest: {
						type: "object",
						properties: {
							rating: { type: "number", minimum: 1, maximum: 5 },
							comment: { type: "string", nullable: true },
						},
					},
					UpdateReviewRequest: {
						type: "object",
						properties: {
							rating: { type: "number", minimum: 1, maximum: 5 },
							comment: { type: "string", nullable: true },
						},
					},
					CreatePresignedUrlRequest: {
						type: "object",
						properties: {
							mimetype: { type: "string" },
							size: { type: "integer" },
							folder: { type: "string", enum: ["location", "place", "user", "itinerary"] },
						},
					},
					PresignedUrlResponse: {
						type: "object",
						required: ["url", "tempKey"],
						properties: {
							url: { type: "string" },
							tempKey: { type: "string" },
						},
					},
					DeleteMediaRequest: {
						type: "object",
						required: ["fileKey"],
						properties: {
							fileKey: { type: "string" },
						},
					},
				},
			},
			security: [{ bearerAuth: [] }],
			tags: [
				{ name: "Health" },
				{ name: "Auth" },
				{ name: "Accounts" },
				{ name: "Admin Accounts" },
				{ name: "Locations" },
				{ name: "Admin Locations" },
				{ name: "Places" },
				{ name: "Admin Places" },
				{ name: "Itineraries" },
				{ name: "Admin Itineraries" },
				{ name: "Community" },
				{ name: "Reviews" },
				{ name: "Admin Reviews" },
				{ name: "Admin Dashboard" },
				{ name: "Media" },
				{ name: "Cron" },
			],
		},
		apis: [
			"./dist/src/index.js",
			"./dist/src/api-docum/*.js",
			"./dist/src/routes/*.js",
			"./dist/src/controllers/*.js",
		],
	});

	return cachedSpec;
};

export const swaggerSpec = getSwaggerSpec();
