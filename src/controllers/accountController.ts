import { NextFunction, Request, Response } from "express";
import {
	adminCreateUserSchema,
	adminGetUsersQuerySchema,
	changeUserStatusSchema,
	getAccountByIdParamsSchema,
	registerAccountSchema,
	updateAccountSchema,
} from "../validations/accountValidation";
import { successResponse } from "../utils/response";
import AccountService from "../services/accountService";
import type { ValidationRequest } from "../types/authType";
import { AppError } from "../middlewares/errorHandler";

class AccountController {
	private static requireAuthenticatedUser(req: ValidationRequest) {
		if (!req.user) {
			throw new AppError("Unauthorized", 401);
		}

		return req.user;
	}

	static async register(req: Request, res: Response, next: NextFunction) {
		try {
			const validatedData = registerAccountSchema.parse(req.body);
			const result = await AccountService.registerAccount(validatedData);

			return successResponse(res, result, "Account registered successfully", 201);
		} catch (error) {
			next(error);
		}
	}

	static async getMyProfile(
		req: ValidationRequest,
		res: Response,
		next: NextFunction,
	) {
		try {
			const user = AccountController.requireAuthenticatedUser(req);

			const result = await AccountService.getAccountById(user.id);

			return successResponse(res, result, "Profile fetched successfully");
		} catch (error) {
			next(error);
		}
	}

	static async updateMyProfile(
		req: ValidationRequest,
		res: Response,
		next: NextFunction,
	) {
		try {
			const user = AccountController.requireAuthenticatedUser(req);

			const validatedData = updateAccountSchema.parse(req.body);
			const result = await AccountService.updateAccount(
				user,
				user.id,
				validatedData,
			);

			return successResponse(res, result, "Profile updated successfully");
		} catch (error) {
			next(error);
		}
	}

	static async getPublicProfile(
		req: Request,
		res: Response,
		next: NextFunction,
	) {
		try {
			const { userId } = getAccountByIdParamsSchema.parse(req.params);
			const result = await AccountService.getPublicAccountById(userId);

			return successResponse(res, result, "Profile fetched successfully");
		} catch (error) {
			next(error);
		}
	}

	static async adminCreateUser(
		req: ValidationRequest,
		res: Response,
		next: NextFunction,
	) {
		try {
			AccountController.requireAuthenticatedUser(req);

			const validatedData = adminCreateUserSchema.parse(req.body);
			const result = await AccountService.createUserByAdmin(validatedData);

			return successResponse(res, result, "User account created successfully", 201);
		} catch (error) {
			next(error);
		}
	}

	static async adminGetUsers(
		req: Request,
		res: Response,
		next: NextFunction,
	) {
		try {
			const validatedQuery = adminGetUsersQuerySchema.parse(req.query);
			const result = await AccountService.getAdminUsers(validatedQuery);

			return successResponse(res, result, "User accounts fetched successfully");
		} catch (error) {
			next(error);
		}
	}

	static async adminGetUser(
		req: Request,
		res: Response,
		next: NextFunction,
	) {
		try {
			const { userId } = getAccountByIdParamsSchema.parse(req.params);
			const result = await AccountService.getAccountById(userId);

			return successResponse(res, result, "User account fetched successfully");
		} catch (error) {
			next(error);
		}
	}

	static async adminUpdateUser(
		req: ValidationRequest,
		res: Response,
		next: NextFunction,
	) {
		try {
			const user = AccountController.requireAuthenticatedUser(req);

			const { userId } = getAccountByIdParamsSchema.parse(req.params);
			const validatedData = updateAccountSchema.parse(req.body);
			const result = await AccountService.updateAccount(user, userId, validatedData);

			return successResponse(res, result, "User account updated successfully");
		} catch (error) {
			next(error);
		}
	}

	static async adminChangeUserStatus(
		req: ValidationRequest,
		res: Response,
		next: NextFunction,
	) {
		try {
			const user = AccountController.requireAuthenticatedUser(req);

			const { userId } = getAccountByIdParamsSchema.parse(req.params);
			const validatedData = changeUserStatusSchema.parse(req.body);
			const result = await AccountService.changeUserStatus(
				user,
				userId,
				validatedData,
			);

			return successResponse(res, result, "User account status updated successfully");
		} catch (error) {
			next(error);
		}
	}
}

export default AccountController;
