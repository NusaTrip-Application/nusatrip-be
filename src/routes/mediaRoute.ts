import { Router } from "express";
import MediaController from "../controllers/mediaController";
import { authenticateToken } from "../middlewares/authMiddleware";

const mediaRouter = Router();

mediaRouter.use(authenticateToken);
mediaRouter.post("/presigned-url", MediaController.generatePresignedUrl);
mediaRouter.delete("/", MediaController.deleteFile);

export default mediaRouter;
