import { AccountStatus, UserRole } from "../../generated/prisma/enums";
import {
	adminCreateUserSchema,
	changeUserStatusSchema,
	getAccountByIdParamsSchema,
	registerAccountSchema,
	updateAccountSchema,
} from "../validations/accountValidation";
import { z } from "zod";

export type RegisterAccountPayload = z.infer<typeof registerAccountSchema>;
export type UpdateAccountPayload = z.infer<typeof updateAccountSchema>;
export type GetAccountByIdParams = z.infer<typeof getAccountByIdParamsSchema>;
export type AdminCreateUserPayload = z.infer<typeof adminCreateUserSchema>;
export type ChangeUserStatusPayload = z.infer<typeof changeUserStatusSchema>;

export type AccountTokenPayload = {
	id: string;
	name: string;
	email: string;
	role: UserRole;
	accountStatus: AccountStatus;
};
