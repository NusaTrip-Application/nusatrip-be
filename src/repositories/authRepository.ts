import { prisma } from "../config/prisma";

class AuthRepository {
	static async findByEmail(email: string) {
		return prisma.user.findUnique({
			where: { email },
		});
	}
}

export default AuthRepository;
