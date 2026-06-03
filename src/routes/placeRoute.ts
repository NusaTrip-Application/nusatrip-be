import { Router } from "express";
import { UserRole } from "../../generated/prisma/enums";
import PlaceController from "../controllers/placeController";
import {
	authenticateToken,
	authorizeRoles,
} from "../middlewares/authMiddleware";

const publicRouter = Router();
const adminRouter = Router();

publicRouter.get("/recommendations", PlaceController.getPlaceRecommendations);
publicRouter.get("/categories", PlaceController.getPlaceCategories);
publicRouter.get("/:placeId", PlaceController.getPublicPlaceById);

adminRouter.use(authenticateToken, authorizeRoles(UserRole.ADMIN));

adminRouter.get("/summary", PlaceController.getPlaceSummary);
adminRouter.get("/", PlaceController.getAdminPlaces);
adminRouter.get("/:placeId", PlaceController.getAdminPlaceById);
adminRouter.post("/", PlaceController.createPlace);
adminRouter.patch("/:placeId", PlaceController.updatePlace);
adminRouter.delete("/:placeId", PlaceController.deletePlace);

export { adminRouter as adminPlaceRouter, publicRouter as publicPlaceRouter };
