import app from "./app";
import { env } from "./config/env";
import { connectDatabase } from "./config/db";
import { logger } from "./config/logger";
import "./models";

const startServer = async () => {
  await connectDatabase();

  const server = app.listen(env.PORT, () => {
    logger.info(`🚀 MMIT IEEE Backend API running on port ${env.PORT} in ${env.NODE_ENV} mode`);
  });

  const handleExit = (signal: string) => {
    logger.info(`Received ${signal}. Shutting down server gracefully...`);
    server.close(() => {
      logger.info("HTTP Server closed.");
      process.exit(0);
    });
  };

  process.on("SIGINT", () => handleExit("SIGINT"));
  process.on("SIGTERM", () => handleExit("SIGTERM"));
};

startServer();
