import { Router } from "express";
import ItineraryController from "../controllers/itineraryController";
import CommunityController from "../controllers/communityController";
import ReviewController from "../controllers/reviewController";
import {
	authenticateToken,
	authorizeRoles,
} from "../middlewares/authMiddleware";
import { UserRole } from "../../generated/prisma/enums";

const publicItineraryRouter = Router();
const adminItineraryRouter = Router();

publicItineraryRouter.get(
	"/community",
	CommunityController.getCommunityItineraries,
);
publicItineraryRouter.get(
	"/community/:itineraryId/summary",
	CommunityController.getCommunitySummary,
);
publicItineraryRouter.get(
	"/community/:itineraryId/author-others",
	CommunityController.getOtherAuthorItineraries,
);
publicItineraryRouter.get(
	"/community/:itineraryId/reviews",
	ReviewController.getPublicReviewsByItinerary,
);

publicItineraryRouter.use(authenticateToken);

publicItineraryRouter.get("/saved", CommunityController.getSavedItineraries);

publicItineraryRouter.get("/", ItineraryController.getMyItineraries);
publicItineraryRouter.post("/", ItineraryController.createItinerary);

publicItineraryRouter.get("/:itineraryId", ItineraryController.getItineraryDetail);
publicItineraryRouter.patch("/:itineraryId", ItineraryController.updateItinerary);
publicItineraryRouter.delete("/:itineraryId", ItineraryController.deleteItinerary);
publicItineraryRouter.patch(
	"/:itineraryId/budget",
	ItineraryController.updateEstimatedTotalBudget,
);

publicItineraryRouter.post("/:itineraryId/save", CommunityController.saveItinerary);
publicItineraryRouter.post(
	"/:itineraryId/duplicate",
	CommunityController.duplicateItinerary,
);
publicItineraryRouter.post(
	"/community/:itineraryId/reviews",
	ReviewController.createReview,
);
publicItineraryRouter.patch(
	"/community/:itineraryId/reviews/:reviewId",
	ReviewController.updateReview,
);
publicItineraryRouter.delete(
	"/community/:itineraryId/reviews/:reviewId",
	ReviewController.deleteReview,
);

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

adminItineraryRouter.use(authenticateToken, authorizeRoles(UserRole.ADMIN));

adminItineraryRouter.get("/summary", ItineraryController.getItinerarySummary);
adminItineraryRouter.get("/", ItineraryController.getAdminItineraries);

export { publicItineraryRouter, adminItineraryRouter };
