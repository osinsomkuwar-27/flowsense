import { config } from "./config";
import { logger } from "./logger";
import { app } from "./api";
import { startScheduler } from "./scheduler";

async function main(): Promise<void> {
  logger.info("FlowZint Pulse Backend starting...", { env: config.env });

  // Start HTTP server
  const server = app.listen(config.port, () => {
    logger.info(`HTTP server listening on port ${config.port}`);
  });

  // Start background polling
  startScheduler();

  // Graceful shutdown
  const shutdown = (): void => {
    logger.info("Shutting down gracefully...");
    server.close(() => {
      logger.info("HTTP server closed");
      process.exit(0);
    });
    setTimeout(() => {
      logger.error("Forced shutdown after timeout");
      process.exit(1);
    }, 10000);
  };

  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);

  process.on("uncaughtException", (err) => {
    logger.error("Uncaught exception", { error: err.message, stack: err.stack });
  });

  process.on("unhandledRejection", (reason) => {
    logger.error("Unhandled promise rejection", { reason });
  });
}

main().catch((err) => {
  console.error("Fatal startup error:", err);
  process.exit(1);
});