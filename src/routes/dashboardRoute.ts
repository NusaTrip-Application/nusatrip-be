import { Router } from "express";
import DashboardController from "../controllers/dashboardController";
import {
	authenticateToken,
	authorizeRoles,
} from "../middlewares/authMiddleware";
import { UserRole } from "../../generated/prisma/enums";

const adminRouter = Router();

adminRouter.use(authenticateToken, authorizeRoles(UserRole.ADMIN));
adminRouter.get("/", DashboardController.getDashboard);

export { adminRouter as adminDashboardRouter };