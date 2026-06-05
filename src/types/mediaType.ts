import { z } from "zod";
import {
	createPresignedUrlSchema,
	deleteMediaSchema,
} from "../validations/mediaValidation";

export type PresignedUrlRequest = {
	mimetype: string;
	size: number;
	userId: string;
	folder: "location" | "place" | "user" | "itinerary";
};

export type PresignedUrlResponse = {
	url: string;
	tempKey: string;
};

export type CreatePresignedUrlPayload = z.infer<
	typeof createPresignedUrlSchema
>;
export type DeleteMediaPayload = z.infer<typeof deleteMediaSchema>;
