import express from "express";
import cors from "cors";
import { env } from "../src/config/env";
import swaggerUi from "swagger-ui-express";
import { errorHandler } from "./middlewares/errorHandler";
import authRoute from "./routes/authRoute";
import cronRoute from "./routes/cronRoute";
import { accountRouter, adminAccountRouter } from "./routes/accountRoute";
import {
	adminLocationRouter,
	publicLocationRouter,
} from "./routes/locationRoute";
import { adminPlaceRouter, publicPlaceRouter } from "./routes/placeRoute";
import {
	adminItineraryRouter,
	publicItineraryRouter,
} from "./routes/itineraryRoute";
import { adminReviewRouter, publicReviewRouter } from "./routes/reviewRoute";
import { adminDashboardRouter } from "./routes/dashboardRoute";
import mediaRouter from "./routes/mediaRoute";
import { swaggerSpec } from "./config/swagger";

const app = express();

app.use(
	cors({
		origin: [
			"http://localhost:3000",
			"http://localhost:5173",
			"https://nusatrip-fe.vercel.app",
		],
		credentials: true,
		methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
		allowedHeaders: ["Content-Type", "Authorization", "Accept"],
	}),
);

app.use(express.json());

if (env.isDevelopment) {
	app.get("/api/docs.json", (_req, res) => {
		res.setHeader("Content-Type", "application/json");
		res.status(200).send(swaggerSpec);
	});

	app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

app.use("/api/auth", authRoute);
app.use("/api/accounts", accountRouter);
app.use("/api/locations", publicLocationRouter);
app.use("/api/places", publicPlaceRouter);
app.use("/api/reviews", publicReviewRouter);
app.use("/api/media", mediaRouter);
app.use("/", cronRoute);
app.use("/api/admin/accounts", adminAccountRouter);
app.use("/api/admin/locations", adminLocationRouter);
app.use("/api/admin/places", adminPlaceRouter);
app.use("/api/itineraries", publicItineraryRouter);
app.use("/api/admin/itineraries", adminItineraryRouter);
app.use("/api/admin/reviews", adminReviewRouter);
app.use("/api/admin/dashboard", adminDashboardRouter);

app.get("/health", (_req, res) => {
	res.status(200).json({
		success: true,
		message: "Server is healthy",
		timestamp: new Date().toISOString(),
		uptime: process.uptime(),
		environment: env.NODE_ENV,
	});
});

app.use(errorHandler);

const PORT = env.PORT || 8000;

if (!env.isTest) {
	app.listen(PORT, () => {
		console.log(`Server is running on port ${PORT}`);
	});
}

export default app;