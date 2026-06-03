import { Router } from "express";
import AccountController from "../controllers/accountController";
import {
	authenticateToken,
	authorizeRoles,
} from "../middlewares/authMiddleware";
import { UserRole } from "../../generated/prisma/enums";

const router = Router();
const adminRouter = Router();

router.post("/register", AccountController.register);
router.get("/me", authenticateToken, AccountController.getMyProfile);
router.patch("/me", authenticateToken, AccountController.updateMyProfile);
router.get("/:userId", authenticateToken, AccountController.getPublicProfile);

adminRouter.use(authenticateToken, authorizeRoles(UserRole.ADMIN));

adminRouter.post("/users", AccountController.adminCreateUser);
adminRouter.get("/users", AccountController.adminGetUsers);
adminRouter.get("/users/:userId", AccountController.adminGetUser);
adminRouter.patch("/users/:userId", AccountController.adminUpdateUser);
adminRouter.patch(
	"/users/:userId/status",
	AccountController.adminChangeUserStatus,
);

export { router as accountRouter, adminRouter as adminAccountRouter };
