import { Router } from "express";
import CronController from "../controllers/cronController";

const cronRouter = Router();

cronRouter.post("/api/cron/media-cleanup", CronController.mediaCleanup);

export default cronRouter;