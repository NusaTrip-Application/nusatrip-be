import request from "supertest";
import { AccountStatus, UserRole } from "../../generated/prisma/enums";
import app from "../index";
import { buildE2EEmail, createTestUser } from "./helpers/testData";

describe("Accounts API E2E", () => {
	describe("POST /api/accounts/register", () => {
		it("registers a new user successfully", async () => {
			const payload = {
				fullName: "[E2E] Register Happy",
				email: buildE2EEmail("register-happy"),
				password: "Password123",
			};

			const response = await request(app)
				.post("/api/accounts/register")
				.send(payload);

			expect(response.status).toBe(201);
			expect(response.body.success).toBe(true);
			expect(response.body.message).toBe("Account registered successfully");
			expect(response.body.data).toEqual(
				expect.objectContaining({
					fullName: payload.fullName,
					email: payload.email,
					role: UserRole.USER,
					accountStatus: AccountStatus.ACTIVE,
				}),
			);
			expect(response.body.data).not.toHaveProperty("password");
			expect(response.body.data).not.toHaveProperty("passwordHash");
		});

		it("rejects duplicate email registration", async () => {
			const email = buildE2EEmail("register-duplicate");
			const payload = {
				fullName: "[E2E] Register Duplicate",
				email,
				password: "Password123",
			};

			await request(app).post("/api/accounts/register").send(payload);
			const response = await request(app)
				.post("/api/accounts/register")
				.send(payload);

			expect(response.status).toBe(409);
			expect(response.body).toEqual({
				success: false,
				message: "Email is already registered",
			});
		});

		it("rejects invalid registration payload", async () => {
			const response = await request(app)
				.post("/api/accounts/register")
				.send({
					fullName: "ab",
					email: "invalid-email",
					password: "123",
				});

			expect(response.status).toBe(400);
			expect(response.body.success).toBe(false);
			expect(response.body.message).toBe("Validation error");
			expect(response.body.errors).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						message: "Fullname must be at least 3 characters",
						path: ["fullName"],
					}),
					expect.objectContaining({
						message: "Email must be a valid email address",
						path: ["email"],
					}),
					expect.objectContaining({
						message: "Password must be at least 8 characters long",
						path: ["password"],
					}),
				]),
			);
		});
	});

	describe("GET /api/accounts/me", () => {
		it("returns unauthorized when token is missing", async () => {
			const response = await request(app).get("/api/accounts/me");

			expect(response.status).toBe(401);
			expect(response.body).toEqual({
				success: false,
				message: "Token tidak ditemukan",
			});
		});

		it("returns the current user profile when token is valid", async () => {
			const { token, user } = await createTestUser({
				email: "me-success@e2e.nusatrip.test",
				fullName: "[E2E] Me Success",
				phoneNumber: "08123456789",
			});

			const response = await request(app)
				.get("/api/accounts/me")
				.set("Authorization", `Bearer ${token}`);

			expect(response.status).toBe(200);
			expect(response.body.success).toBe(true);
			expect(response.body.message).toBe("Profile fetched successfully");
			expect(response.body.data).toEqual(
				expect.objectContaining({
					userId: user.userId,
					fullName: user.fullName,
					email: user.email,
					phoneNumber: "08123456789",
				}),
			);
		});
	});

	describe("PATCH /api/accounts/me", () => {
		it("updates the authenticated user's profile", async () => {
			const { token } = await createTestUser({
				email: "update-me@e2e.nusatrip.test",
				fullName: "[E2E] Update Me",
			});

			const response = await request(app)
				.patch("/api/accounts/me")
				.set("Authorization", `Bearer ${token}`)
				.send({
					fullName: "[E2E] Updated Name",
					phoneNumber: "08123456789",
					instagramUsername: "e2eaccount",
					profilePhotoUrl: "https://example.com/e2e-photo.jpg",
				});

			expect(response.status).toBe(200);
			expect(response.body.success).toBe(true);
			expect(response.body.message).toBe("Profile updated successfully");
			expect(response.body.data).toEqual(
				expect.objectContaining({
					fullName: "[E2E] Updated Name",
					phoneNumber: "08123456789",
					instagramUsername: "e2eaccount",
					profilePhotoUrl: "https://example.com/e2e-photo.jpg",
				}),
			);
		});

		it("rejects an empty update payload", async () => {
			const { token } = await createTestUser({
				email: "update-empty@e2e.nusatrip.test",
				fullName: "[E2E] Update Empty",
			});

			const response = await request(app)
				.patch("/api/accounts/me")
				.set("Authorization", `Bearer ${token}`)
				.send({});

			expect(response.status).toBe(400);
			expect(response.body.success).toBe(false);
			expect(response.body.message).toBe("Validation error");
			expect(response.body.errors).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						message: "At least one field must be provided",
					}),
				]),
			);
		});
	});

	describe("GET /api/accounts/:userId", () => {
		it("returns public profile for an active user", async () => {
			const { token } = await createTestUser({
				email: "viewer@e2e.nusatrip.test",
				fullName: "[E2E] Viewer",
			});
			const { user: targetUser } = await createTestUser({
				email: "public-profile@e2e.nusatrip.test",
				fullName: "[E2E] Public Profile",
				instagramUsername: "publicaccount",
			});

			const response = await request(app)
				.get(`/api/accounts/${targetUser.userId}`)
				.set("Authorization", `Bearer ${token}`);

			expect(response.status).toBe(200);
			expect(response.body.success).toBe(true);
			expect(response.body.data).toEqual(
				expect.objectContaining({
					userId: targetUser.userId,
					fullName: targetUser.fullName,
					email: targetUser.email,
					instagramUsername: "publicaccount",
				}),
			);
			expect(response.body.data).not.toHaveProperty("phoneNumber");
		});

		it("returns not found for an inactive public profile", async () => {
			const { token } = await createTestUser({
				email: "viewer-inactive@e2e.nusatrip.test",
				fullName: "[E2E] Viewer Inactive",
			});
			const { user: inactiveUser } = await createTestUser({
				email: "inactive-public@e2e.nusatrip.test",
				fullName: "[E2E] Inactive Public",
				accountStatus: AccountStatus.INACTIVE,
			});

			const response = await request(app)
				.get(`/api/accounts/${inactiveUser.userId}`)
				.set("Authorization", `Bearer ${token}`);

			expect(response.status).toBe(404);
			expect(response.body).toEqual({
				success: false,
				message: "Account not found",
			});
		});
	});

	describe("Admin account routes", () => {
		it("rejects a non-admin user from accessing admin endpoints", async () => {
			const { token, user } = await createTestUser({
				email: "non-admin@e2e.nusatrip.test",
				fullName: "[E2E] Non Admin",
			});

			const response = await request(app)
				.patch(`/api/admin/accounts/users/${user.userId}/status`)
				.set("Authorization", `Bearer ${token}`)
				.send({ accountStatus: AccountStatus.INACTIVE });

			expect(response.status).toBe(403);
			expect(response.body).toEqual({
				success: false,
				message: "Forbidden",
			});
		});

		it("allows an admin to change another user's status", async () => {
			const { token: adminToken } = await createTestUser({
				email: "admin-status@e2e.nusatrip.test",
				fullName: "[E2E] Admin Status",
				role: UserRole.ADMIN,
			});
			const { user: targetUser } = await createTestUser({
				email: "status-target@e2e.nusatrip.test",
				fullName: "[E2E] Status Target",
			});

			const response = await request(app)
				.patch(`/api/admin/accounts/users/${targetUser.userId}/status`)
				.set("Authorization", `Bearer ${adminToken}`)
				.send({ accountStatus: AccountStatus.INACTIVE });

			expect(response.status).toBe(200);
			expect(response.body.success).toBe(true);
			expect(response.body.message).toBe(
				"User account status updated successfully",
			);
			expect(response.body.data).toEqual(
				expect.objectContaining({
					userId: targetUser.userId,
					accountStatus: AccountStatus.INACTIVE,
				}),
			);
		});

		it("prevents an admin from changing their own status", async () => {
			const { token, user } = await createTestUser({
				email: "admin-self-status@e2e.nusatrip.test",
				fullName: "[E2E] Admin Self Status",
				role: UserRole.ADMIN,
			});

			const response = await request(app)
				.patch(`/api/admin/accounts/users/${user.userId}/status`)
				.set("Authorization", `Bearer ${token}`)
				.send({ accountStatus: AccountStatus.INACTIVE });

			expect(response.status).toBe(400);
			expect(response.body).toEqual({
				success: false,
				message: "Admin account status cannot be changed here",
			});
		});
	});
});
