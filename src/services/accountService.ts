import bcrypt from "bcrypt";
import { AccountStatus, UserRole } from "../../generated/prisma/enums";
import type { Prisma } from "../../generated/prisma/client";
import { AppError } from "../middlewares/errorHandler";
import AccountRepository from "../repositories/accountRepository";
import type {
	AdminCreateUserPayload,
	ChangeUserStatusPayload,
	RegisterAccountPayload,
	UpdateAccountPayload,
} from "../types/accountType";
import type { UserData } from "../types/authType";

class AccountService {
	static async registerAccount(payload: RegisterAccountPayload) {
		const existingUser = await AccountRepository.findByEmail(payload.email);
		if (existingUser) {
			throw new AppError("Email is already registered", 409);
		}

		const passwordHash = await bcrypt.hash(payload.password, 10);
		const createPayload: Prisma.UserCreateInput = {
			fullName: payload.fullName,
			email: payload.email,
			passwordHash,
			role: UserRole.USER,
			accountStatus: AccountStatus.ACTIVE,
		};

		return AccountRepository.createAccount(createPayload);
	}

	static async getAccountById(userId: string) {
		const account = await AccountRepository.findAccountById(userId);

		if (!account) {
			throw new AppError("Account not found", 404);
		}

		return account;
	}

	static async getPublicAccountById(userId: string) {
		const account = await AccountRepository.findPublicAccountById(userId);

		if (!account) {
			throw new AppError("Account not found", 404);
		}

		return account;
	}

	static async createUserByAdmin(payload: AdminCreateUserPayload) {
		const existingUser = await AccountRepository.findByEmail(payload.email);
		if (existingUser) {
			throw new AppError("Email is already registered", 409);
		}

		const passwordHash = await bcrypt.hash(payload.password, 10);
		const createPayload: Prisma.UserCreateInput = {
			fullName: payload.fullName,
			email: payload.email,
			passwordHash,
			...(payload.phoneNumber ? { phoneNumber: payload.phoneNumber } : {}),
			...(payload.instagramUsername
				? { instagramUsername: payload.instagramUsername }
				: {}),
			...(payload.profilePhotoUrl
				? { profilePhotoUrl: payload.profilePhotoUrl }
				: {}),
			role: UserRole.USER,
			accountStatus: payload.accountStatus ?? AccountStatus.ACTIVE,
		};

		return AccountRepository.createAccount(createPayload);
	}

	static async updateAccount(
		currentUser: UserData,
		userId: string,
		payload: UpdateAccountPayload,
	) {
		const isOwnAccount = currentUser.id === userId;

		if (!isOwnAccount && currentUser.role !== UserRole.ADMIN) {
			throw new AppError("Forbidden", 403);
		}

		const account = await this.getAccountById(userId);

		const normalizedPayload = normalizeOptionalStringFields(payload);
		const { password, ...restPayload } = normalizedPayload;
		const preparedPayload: Record<string, unknown> = { ...restPayload };

		if (typeof password === "string" && password.length > 0) {
			preparedPayload.passwordHash = await bcrypt.hash(password, 10);
		}

		if (
			preparedPayload.email &&
			preparedPayload.email !== account.email &&
			typeof preparedPayload.email === "string"
		) {
			const existingUser = await AccountRepository.findByEmail(
				preparedPayload.email,
			);

			if (existingUser && existingUser.userId !== userId) {
				throw new AppError("Email is already registered", 409);
			}
		}

		return AccountRepository.updateAccountById(userId, preparedPayload);
	}

	static async changeUserStatus(
		currentUser: UserData,
		userId: string,
		payload: ChangeUserStatusPayload,
	) {
		const account = await this.getAccountById(userId);

		if (account.role === UserRole.ADMIN) {
			throw new AppError("Admin account status cannot be changed here", 400);
		}

		if (currentUser.id === userId) {
			throw new AppError("You cannot change your own account status", 400);
		}

		if (account.accountStatus === payload.accountStatus) {
			throw new AppError(
				"Account status is already set to the requested value",
				400,
			);
		}

		return AccountRepository.updateUserStatus(userId, payload.accountStatus);
	}
}

function normalizeOptionalStringFields<T extends Record<string, unknown>>(
	payload: T,
): T {
	return Object.fromEntries(
		Object.entries(payload).map(([key, value]) => [
			key,
			value === "" ? null : value,
		]),
	) as T;
}

export default AccountService;
