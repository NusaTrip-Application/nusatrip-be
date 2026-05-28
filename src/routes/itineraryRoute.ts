import { Router } from "express";
import ItineraryController from "../controllers/itineraryController";
import { authenticateToken, authorizeRoles } from "../middlewares/authMiddleware";
import { UserRole } from "../../generated/prisma/enums";

const publicItineraryRouter = Router();
const adminItineraryRouter = Router();

publicItineraryRouter.use(authenticateToken);

publicItineraryRouter.post("/", ItineraryController.createItinerary);
publicItineraryRouter.get("/", ItineraryController.getMyItineraries);
publicItineraryRouter.post(
	"/:itineraryId/items",
	ItineraryController.createItineraryItem,
);
publicItineraryRouter.patch(
	"/:itineraryId/items/:itineraryItemId",
	ItineraryController.updateItineraryItem,
);
publicItineraryRouter.delete(
	"/:itineraryId/items/:itineraryItemId",
	ItineraryController.deleteItineraryItem,
);
publicItineraryRouter.get("/:itineraryId", ItineraryController.getItineraryDetail);
publicItineraryRouter.patch("/:itineraryId", ItineraryController.updateItinerary);
publicItineraryRouter.delete("/:itineraryId", ItineraryController.deleteItinerary);
publicItineraryRouter.patch(
	"/:itineraryId/budget",
	ItineraryController.updateEstimatedTotalBudget,
);

adminItineraryRouter.use(authenticateToken, authorizeRoles(UserRole.ADMIN));

adminItineraryRouter.get("/summary", ItineraryController.getItinerarySummary);
adminItineraryRouter.get("/", ItineraryController.getAdminItineraries);

export { publicItineraryRouter, adminItineraryRouter };
