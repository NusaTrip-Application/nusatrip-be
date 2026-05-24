import { AccountStatus, UserRole } from "../../generated/prisma/enums";
import type { Prisma } from "../../generated/prisma/client";
import { prisma } from "../config/prisma";
import type { AdminGetUsersQuery } from "../types/accountType";

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

const adminUserListSelect = {
	userId: true,
	fullName: true,
	email: true,
	phoneNumber: true,
	instagramUsername: true,
	profilePhotoUrl: true,
	accountStatus: true,
	createdAt: true,
	updatedAt: true,
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

	static async findAdminUsers(query: AdminGetUsersQuery) {
		const where: Prisma.UserWhereInput = {
			role: UserRole.USER,
			...(query.accountStatus ? { accountStatus: query.accountStatus } : {}),
			...(query.search
				? {
						fullName: {
							contains: query.search,
							mode: "insensitive",
						},
				  }
				: {}),
		};

		const orderBy = mapAdminUserSort(query.sortBy);
		const skip = (query.page - 1) * query.limit;

		const [items, totalItems] = await prisma.$transaction([
			prisma.user.findMany({
				where,
				orderBy,
				skip,
				take: query.limit,
				select: adminUserListSelect,
			}),
			prisma.user.count({ where }),
		]);

		return { items, totalItems };
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

function mapAdminUserSort(sortBy: AdminGetUsersQuery["sortBy"]): Prisma.UserOrderByWithRelationInput {
	switch (sortBy) {
		case "nameAsc":
			return { fullName: "asc" };
		case "nameDesc":
			return { fullName: "desc" };
		case "createdAtAsc":
			return { createdAt: "asc" };
		case "createdAtDesc":
		default:
			return { createdAt: "desc" };
	}
}

function omitUndefined<T extends Record<string, unknown>>(payload: T): Partial<T> {
	return Object.fromEntries(
		Object.entries(payload).filter(([, value]) => value !== undefined),
	) as Partial<T>;
}

export default AccountRepository;
