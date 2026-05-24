import { Response } from "express";

export type ApiSuccess<T> = {
	success: true;
	message: string;
	data: T;
};

export function successResponse<T>(
	res: Response,
	data: T,
	message = "success",
	status = 200,
) {
	const payload: ApiSuccess<T> = { success: true, message, data };
	return res.status(status).json(payload);
}
