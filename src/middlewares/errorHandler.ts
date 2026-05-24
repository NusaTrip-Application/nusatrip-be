import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

export class AppError extends Error {
	statusCode: number;
	details?: unknown;

	constructor(message: string, statusCode = 500, details?: unknown) {
		super(message);
		this.statusCode = statusCode;
		this.details = details;
	}
}

export function errorHandler(
	err: unknown,
	_req: Request,
	res: Response,
	_next: NextFunction,
) {
	if (err instanceof ZodError) {
		return res.status(400).json({
			success: false,
			message: "Validation error",
			errors: err.issues,
		});
	}

	if (err instanceof AppError) {
		return res.status(err.statusCode).json({
			success: false,
			message: err.message,
			errors: err.details,
		});
	}

	console.error(err);

	return res.status(500).json({
		success: false,
		message: "Internal server error",
	});
}
