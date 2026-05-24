import { Router } from "express";
import LocationController from "../controllers/locationController";
import {
	authenticateToken,
	authorizeRoles,
} from "../middlewares/authMiddleware";
import { UserRole } from "../../generated/prisma/enums";

const publicRouter = Router();
const adminRouter = Router();

publicRouter.get("/", LocationController.publicGetLocations);
publicRouter.get("/:locationId", LocationController.publicGetLocationById);

adminRouter.use(authenticateToken, authorizeRoles(UserRole.ADMIN));
adminRouter.get("summary", LocationController.getLocationSummary);
adminRouter.get("/", LocationController.adminGetLocations);
adminRouter.get("/:locationId", LocationController.getLocationById);
adminRouter.post("/", LocationController.createLocation);
adminRouter.patch("/:locationId", LocationController.updateLocation);
adminRouter.delete("/:locationId", LocationController.deleteLocation);
adminRouter.patch(
	"/:locationId/status",
	LocationController.changeLocationStatus,
);

export {
	adminRouter as adminLocationRouter,
	publicRouter as publicLocationRouter,
};
