import express from "express";
import cors from "cors";
import { env } from "../src/config/env";
import { errorHandler } from "./middlewares/errorHandler";
import authRoute from "./routes/authRoute";
import { accountRouter, adminAccountRouter } from "./routes/accountRoute";

const app = express();

app.use(
	cors({
		origin: [],
		credentials: true,
		methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
		allowedHeaders: ["Content-Type", "Authorization", "Accept"],
	}),
);

app.use(express.json());
app.use("/api/auth", authRoute);
app.use("/api/accounts", accountRouter);
app.use("/api/admin/accounts", adminAccountRouter);

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

const PORT = env.PORT || 3000;

if (!env.isTest) {
	app.listen(PORT, () => {
		console.log(`Server is running on port ${PORT}`);
	});
}

export default app;
