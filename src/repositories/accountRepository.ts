import { AccountStatus, UserRole } from "../../generated/prisma/enums";
import type { Prisma } from "../../generated/prisma/client";
import { prisma } from "../config/prisma";

const ownAccountSelect = {
	userId: true,
	fullName: true,
	email: true,
	phoneNumber: true,
	instagramUsername: true,
	profilePhotoUrl: true,
	role: true,
	accountStatus: true,
	createdAt: true,
	updatedAt: true,
} as const;

const publicAccountSelect = {
	userId: true,
	fullName: true,
	email: true,
	instagramUsername: true,
	profilePhotoUrl: true,
	role: true,
	createdAt: true,
} as const;

class AccountRepository {
	static async findByEmail(email: string) {
		return prisma.user.findUnique({
			where: { email },
		});
	}

	static async findAccountById(userId: string) {
		return prisma.user.findUnique({
			where: { userId },
			select: ownAccountSelect,
		});
	}

	static async findPublicAccountById(userId: string) {
		return prisma.user.findFirst({
			where: {
				userId,
				accountStatus: AccountStatus.ACTIVE,
			},
			select: publicAccountSelect,
		});
	}

	static async createAccount(payload: Prisma.UserCreateInput) {
		return prisma.user.create({
			data: payload,
			select: ownAccountSelect,
		});
	}

	static async updateAccountById(
		userId: string,
		payload: Record<string, unknown>,
	) {
		return prisma.user.update({
			where: { userId },
			data: omitUndefined(payload),
			select: ownAccountSelect,
		});
	}

	static async updateUserStatus(userId: string, accountStatus: AccountStatus) {
		return prisma.user.update({
			where: { userId },
			data: { accountStatus },
			select: ownAccountSelect,
		});
	}
}

function omitUndefined<T extends Record<string, unknown>>(payload: T): Partial<T> {
	return Object.fromEntries(
		Object.entries(payload).filter(([, value]) => value !== undefined),
	) as Partial<T>;
}

export default AccountRepository;
