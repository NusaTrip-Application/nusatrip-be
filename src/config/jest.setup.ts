import { prisma } from "../config/prisma";
import { cleanupE2EUsers } from "../test/helpers/testData";

jest.setTimeout(30000);

beforeEach(async () => {
	await cleanupE2EUsers();
});

afterEach(async () => {
	await cleanupE2EUsers();
});

afterAll(async () => {
	await cleanupE2EUsers();
	await prisma.$disconnect();
});
