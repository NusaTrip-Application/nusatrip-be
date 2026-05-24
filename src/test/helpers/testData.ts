import bcrypt from "bcrypt";
import { AccountStatus, UserRole } from "../../../generated/prisma/enums";
import { prisma } from "../../config/prisma";
import { generateTokens } from "../../utils/jwt";

const E2E_EMAIL_DOMAIN = "@e2e.nusatrip.test";
const E2E_NAME_PREFIX = "[E2E]";

type CreateTestUserOptions = {
	fullName?: string;
	email?: string;
	password?: string;
	role?: UserRole;
	accountStatus?: AccountStatus;
	phoneNumber?: string | null;
	instagramUsername?: string | null;
	profilePhotoUrl?: string | null;
};

export function buildE2EEmail(label: string) {
	return `${label.toLowerCase()}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}${E2E_EMAIL_DOMAIN}`;
}

export async function cleanupE2EUsers() {
	await prisma.user.deleteMany({
		where: {
			OR: [
				{ email: { endsWith: E2E_EMAIL_DOMAIN } },
				{ fullName: { startsWith: E2E_NAME_PREFIX } },
			],
		},
	});
}

export async function createTestUser(options: CreateTestUserOptions = {}) {
	const password = options.password ?? "Password123";
	const email = options.email ?? buildE2EEmail("user");
	const fullName = options.fullName ?? `${E2E_NAME_PREFIX} Test User`;
	const passwordHash = await bcrypt.hash(password, 10);

	const user = await prisma.user.create({
		data: {
			fullName,
			email,
			passwordHash,
			role: options.role ?? UserRole.USER,
			accountStatus: options.accountStatus ?? AccountStatus.ACTIVE,
			phoneNumber: options.phoneNumber ?? null,
			instagramUsername: options.instagramUsername ?? null,
			profilePhotoUrl: options.profilePhotoUrl ?? null,
		},
	});

	return {
		user,
		password,
		token: generateTokens({
			id: user.userId,
			name: user.fullName,
			email: user.email,
			role: user.role,
			accountStatus: user.accountStatus,
		}).accessToken,
	};
}
