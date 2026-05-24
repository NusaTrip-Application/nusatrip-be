import request from "supertest";
import app from "../index";
import { createTestUser } from "./helpers/testData";

describe("Auth API E2E", () => {
	describe("POST /api/auth/login", () => {
		it("returns an access token when credentials are valid", async () => {
			const { user, password } = await createTestUser({
				email: "login-happy@e2e.nusatrip.test",
				fullName: "[E2E] Login Happy",
			});

			const response = await request(app).post("/api/auth/login").send({
				email: user.email,
				password,
			});

			expect(response.status).toBe(200);
			expect(response.body).toEqual({
				success: true,
				message: "Login successful",
				data: {
					accessToken: expect.any(String),
				},
			});
		});

		it("normalizes email casing before login", async () => {
			const { user, password } = await createTestUser({
				email: "login-uppercase@e2e.nusatrip.test",
				fullName: "[E2E] Login Uppercase",
			});

			const response = await request(app).post("/api/auth/login").send({
				email: user.email.toUpperCase(),
				password,
			});

			expect(response.status).toBe(200);
			expect(response.body.success).toBe(true);
			expect(response.body.data.accessToken).toEqual(expect.any(String));
		});

		it("rejects login when email does not exist", async () => {
			const response = await request(app).post("/api/auth/login").send({
				email: "missing-user@e2e.nusatrip.test",
				password: "Password123",
			});

			expect(response.status).toBe(404);
			expect(response.body).toEqual({
				success: false,
				message: "Email does not exist",
			});
		});

		it("rejects login when password is incorrect", async () => {
			const { user } = await createTestUser({
				email: "login-wrong-password@e2e.nusatrip.test",
				fullName: "[E2E] Login Wrong Password",
			});

			const response = await request(app).post("/api/auth/login").send({
				email: user.email,
				password: "WrongPass123",
			});

			expect(response.status).toBe(401);
			expect(response.body).toEqual({
				success: false,
				message: "Incorrect password",
			});
		});

		it("returns validation error for malformed payload", async () => {
			const response = await request(app).post("/api/auth/login").send({
				email: "not-an-email",
				password: "short",
			});

			expect(response.status).toBe(400);
			expect(response.body.success).toBe(false);
			expect(response.body.message).toBe("Validation error");
			expect(response.body.errors).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						message: "Invalid email format",
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

	describe("POST /api/auth/logout", () => {
		it("returns a success response", async () => {
			const response = await request(app).post("/api/auth/logout");

			expect(response.status).toBe(200);
			expect(response.body).toEqual({
				success: true,
				message: "Logout berhasil",
				data: null,
			});
		});
	});
});
