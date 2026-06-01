import { Router } from "express";
import { UserRole } from "../../generated/prisma/enums";
import ReviewController from "../controllers/reviewController";
import {
	authenticateToken,
	authorizeRoles,
} from "../middlewares/authMiddleware";

const publicRouter = Router();
const adminRouter = Router();

publicRouter.get("/", ReviewController.getPublicReviews);
publicRouter.post(
	"/itineraries/:itineraryId",
	authenticateToken,
	ReviewController.createReview,
);
publicRouter.patch(
	"/:reviewId",
	authenticateToken,
	ReviewController.updateReview,
);
publicRouter.delete(
	"/:reviewId",
	authenticateToken,
	ReviewController.deleteReview,
);

adminRouter.use(authenticateToken, authorizeRoles(UserRole.ADMIN));
adminRouter.get("/summary", ReviewController.getReviewSummary);
adminRouter.get("/", ReviewController.getAdminReviews);

export { adminRouter as adminReviewRouter, publicRouter as publicReviewRouter };
