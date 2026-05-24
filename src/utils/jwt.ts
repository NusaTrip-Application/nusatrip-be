import jwt, { type SignOptions } from "jsonwebtoken";
import { env } from "../config/env";
import { AccountTokenPayload } from "../types/accountType";

export function generateTokens(payload: AccountTokenPayload) {
	const expiresIn = env.JWT_EXPIRE as NonNullable<SignOptions["expiresIn"]>;

	const accessToken = jwt.sign(payload, env.ACCESS_TOKEN_SECRET, {
		expiresIn,
	});

	return {
		accessToken,
	};
}
