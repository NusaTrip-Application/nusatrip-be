import { loginSchema } from "../validations/authValidation";
import { z } from "zod";
import { AccountStatus, UserRole } from "../../generated/prisma/enums";
import type { Request as ExpressRequest } from "express";

export type LoginPayload = z.infer<typeof loginSchema>;

export type UserData = {
	id: string;
	name: string;
	email: string;
	role: UserRole;
	accountStatus: AccountStatus;
};

export interface ValidationRequest extends ExpressRequest {
	user?: UserData;
}
