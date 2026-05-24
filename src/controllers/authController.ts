import { NextFunction, Request, Response } from "express";
import { loginSchema } from "../validations/authValidation";
import { successResponse } from "../utils/response";
import AuthService from "../services/authService";

class AuthController {
	static async login(req: Request, res: Response, next: NextFunction) {
		try {
			const validatedData = loginSchema.parse(req.body);
			const result = await AuthService.handleLogin(validatedData);

			return successResponse(res, result, "Login successful");
		} catch (error) {
			next(error);
		}
	}

	static logout(req: Request, res: Response, next: NextFunction) {
		try {
			AuthService.handleLogout(req, res);

			return successResponse(res, null, "Logout berhasil");
		} catch (error) {
			next(error);
		}
	}
}

export default AuthController;
