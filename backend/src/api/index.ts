import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { requestLogger } from "./middleware/requestLogger";
import { errorHandler } from "./middleware/errorHandler";
import healthRouter from "./routes/health";
import eventsRouter from "./routes/events";
import anomalyRouter from "./routes/anomaly";
import workflowRouter from "./routes/workflow";
import integrationsRouter from "./routes/integrations";
import authRouter from "./routes/auth";

const app = express();

// Security
app.use(helmet());
app.use(cors({ origin: "*" })); // Tighten in production
app.use(
  rateLimit({
    windowMs: 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

// Body parsing
app.use(express.json({ limit: "2mb" }));

// Logging
app.use(requestLogger);

// Routes
app.use("/health", healthRouter);
app.use("/api/events", eventsRouter);
app.use("/api/anomaly", anomalyRouter);
app.use("/api/workflow", workflowRouter);
app.use("/api/integrations", integrationsRouter);
app.use("/api/auth", authRouter);

// 404
app.use((_req, res) => {
  res.status(404).json({ success: false, error: "Not found" });
});

// Error handler
app.use(errorHandler);

export { app };