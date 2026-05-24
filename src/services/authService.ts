import bcrypt from "bcrypt";
import type { Request, Response } from "express";
import { LoginPayload } from "../types/authType";
import AuthRepository from "../repositories/authRepository";
import { AppError } from "../middlewares/errorHandler";
import { generateTokens } from "../utils/jwt";

class AuthService {
	static async handleLogin(payload: LoginPayload) {
		const user = await AuthRepository.findByEmail(payload.email);

		if (!user) {
			throw new AppError("Email does not exist", 404);
		}

		const isPasswordValid = await bcrypt.compare(
			payload.password,
			user.passwordHash,
		);

		if (!isPasswordValid) {
			throw new AppError("Incorrect password", 401);
		}

		const tokens = generateTokens({
			id: user.userId,
			name: user.fullName,
			email: user.email,
			role: user.role,
			accountStatus: user.accountStatus,
		});

		return tokens;
	}

	static handleLogout(req: Request, res: Response) {
		res.clearCookie("jwt", {
			httpOnly: true,
			sameSite: "none",
			secure: true,
		});
	}
}

export default AuthService;
