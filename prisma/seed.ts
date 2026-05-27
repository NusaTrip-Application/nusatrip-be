import bcrypt from "bcrypt";
import {
	AccountStatus,
	PlaceCategoryEnum,
	UserRole,
} from "../generated/prisma/enums";
import { prisma } from "../src/config/prisma";

const PROVINCES = [
	{ provinceName: "Nanggroe Aceh Darussalam", order: 1 },
	{ provinceName: "Sumatera Utara", order: 2 },
	{ provinceName: "Sumatera Barat", order: 3 },
	{ provinceName: "Riau", order: 4 },
	{ provinceName: "Kepulauan Riau", order: 5 },
	{ provinceName: "Jambi", order: 6 },
	{ provinceName: "Bengkulu", order: 7 },
	{ provinceName: "Sumatera Selatan", order: 8 },
	{ provinceName: "Bangka Belitung", order: 9 },
	{ provinceName: "Lampung", order: 10 },
	{ provinceName: "Banten", order: 11 },
	{ provinceName: "DKI Jakarta", order: 12 },
	{ provinceName: "Jawa Barat", order: 13 },
	{ provinceName: "Jawa Tengah", order: 14 },
	{ provinceName: "Daerah Istimewa Yogyakarta", order: 15 },
	{ provinceName: "Jawa Timur", order: 16 },
	{ provinceName: "Bali", order: 17 },
	{ provinceName: "Nusa Tenggara Barat", order: 18 },
	{ provinceName: "Nusa Tenggara Timur", order: 19 },
	{ provinceName: "Kalimantan Barat", order: 20 },
	{ provinceName: "Kalimantan Tengah", order: 21 },
	{ provinceName: "Kalimantan Selatan", order: 22 },
	{ provinceName: "Kalimantan Timur", order: 23 },
	{ provinceName: "Kalimantan Utara", order: 24 },
	{ provinceName: "Sulawesi Utara", order: 25 },
	{ provinceName: "Gorontalo", order: 26 },
	{ provinceName: "Sulawesi Tengah", order: 27 },
	{ provinceName: "Sulawesi Barat", order: 28 },
	{ provinceName: "Sulawesi Selatan", order: 29 },
	{ provinceName: "Sulawesi Tenggara", order: 30 },
	{ provinceName: "Maluku", order: 31 },
	{ provinceName: "Maluku Utara", order: 32 },
	{ provinceName: "Papua Barat", order: 33 },
	{ provinceName: "Papua Barat Daya", order: 34 },
	{ provinceName: "Papua", order: 35 },
	{ provinceName: "Papua Tengah", order: 36 },
	{ provinceName: "Papua Pegunungan", order: 37 },
	{ provinceName: "Papua Selatan", order: 38 },
] as const;

async function seedAdmin() {
	await prisma.user.create({
		data: {
			fullName: "NusaTrip Admin",
			email: "admin@gmail.com",
			passwordHash: await bcrypt.hash("Admin123", 10),
			role: UserRole.ADMIN,
			accountStatus: AccountStatus.ACTIVE,
		},
	});
}

async function seedProvinces() {
	for (const province of PROVINCES) {
		await prisma.province.upsert({
			where: { provinceName: province.provinceName },
			create: {
				provinceName: province.provinceName,
				order: province.order,
				isActive: true,
			},
			update: {
				order: province.order,
				isActive: true,
			},
		});
	}
}

async function seedPlaceCategories() {
	const categories = Object.values(PlaceCategoryEnum);
	for (const categoryName of categories) {
		await prisma.placeCategory.upsert({
			where: { categoryName },
			create: { categoryName, isActive: true },
			update: { isActive: true },
		});
	}
}

async function main() {
	console.log("Seeding database...");

	await seedAdmin();
	await seedProvinces();
	await seedPlaceCategories();

	console.log("Seeding complete.");
}

main()
	.catch((e) => {
		console.error("Seed failed:", e);
		process.exitCode = 1;
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
