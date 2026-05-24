import {
	adminGetLocationsQuerySchema,
	changeLocationStatusSchema,
	createLocationSchema,
	getLocationByIdParamsSchema,
	publicGetLocationsQuerySchema,
	updateLocationSchema,
} from "../validations/locationValidation";
import { z } from "zod";

export type GetLocationByIdParams = z.infer<typeof getLocationByIdParamsSchema>;
export type AdminGetLocationsQuery = z.infer<typeof adminGetLocationsQuerySchema>;
export type PublicGetLocationsQuery = z.infer<typeof publicGetLocationsQuerySchema>;
export type CreateLocationPayload = z.infer<typeof createLocationSchema>;
export type UpdateLocationPayload = z.infer<typeof updateLocationSchema>;
export type ChangeLocationStatusPayload = z.infer<typeof changeLocationStatusSchema>;
