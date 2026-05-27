import { Request, Response, NextFunction } from "express";
import { AppError } from "./errorHandler";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { UserData, ValidationRequest } from "../types/authType";
import { UserRole } from "../../generated/prisma/enums";

export function authenticateToken(
	req: Request,
	_res: Response,
	next: NextFunction,
) {
	try {
		const token = req.headers.authorization?.replace("Bearer ", "");

		if (!token) {
			throw new AppError("Token not found", 401);
		}

		const decoded = jwt.verify(token, env.ACCESS_TOKEN_SECRET) as UserData;

		if (!decoded || typeof decoded === "string" || !decoded.id) {
			throw new AppError("Token invalid", 401);
		}

		const userData: UserData = {
			id: decoded.id,
			name: decoded.name,
			email: decoded.email,
			role: decoded.role,
			accountStatus: decoded.accountStatus,
		};

		(req as ValidationRequest).user = userData;
		return next();
	} catch (err) {
		return next(err instanceof AppError ? err : new AppError("Token invalid", 401));
	}
}

export function authorizeRoles(...roles: UserRole[]) {
	return (req: Request, _res: Response, next: NextFunction) => {
		const user = (req as ValidationRequest).user;

		if (!user) {
			return next(new AppError("Unauthorized", 401));
		}

		if (!roles.includes(user.role)) {
			return next(new AppError("Forbidden", 403));
		}

		return next();
	};
}
