import { PORT, LOG_FORMAT, ORIGIN, CREDENTIALS, NODE_ENV } from "@config";
import { logger, stream } from "@utils/logger";
import swaggerDocs from "@utils/swagger";

import express from "express";
import morgan from "morgan";
import cors from "cors";

import compression from "compression";
import cookieParser from "cookie-parser";
import helmet from "helmet";

import appRoute from "./modules/app/app.route";

import trimStrings from "@middlewares/trim-strings.middleware";
import errorMiddleware from "@middlewares/error.middleware";
import convertEmptyStringsToNull from "@middlewares/convert-empty-strings-to-null.middleware";

import cron from "node-cron";

import listingsCron from "@modules/listings/listings.cron";
import leadsCron from "@modules/leads/leads.cron";
import viewingsCron from "./modules/viewings/viewings.cron";

import client from "./db/client";

const app = express();

app.use(morgan(LOG_FORMAT, { stream }));
app.use(
  cors({ origin: [ORIGIN, "http://localhost:5173"], credentials: CREDENTIALS })
);
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(trimStrings());
app.use(convertEmptyStringsToNull);

/** Initialize helmet after Swagger so it doesn't force https */
app.use(
  helmet({
    hidePoweredBy: true,
  })
);

swaggerDocs(app);

app.get("/healthcheck", (req, res) => {
  res.send({ status: "ok" });
});

app.use("/", appRoute);

app.use(errorMiddleware);

const port = PORT || 3000;

// Initialize server with database connection check
async function startServer() {
  try {
    // Test database connection
    logger.info("🔌 Testing database connection...");
    await client.$connect();
    logger.info("✅ Database connected successfully!");
    logger.info("");

    // Start the server
    const server = app.listen(port, () => {
      logger.info(`[${NODE_ENV}] Server listening on port ${PORT} 🚀`);
      logger.info(`📃 Docs available on http://localhost:${PORT}/api-docs`);
      logger.info("");
    });

    // Setup cron jobs
    try {
      logger.info("⏰ Setting up cron jobs...");
      cron.schedule("* * * * *", listingsCron, { runOnInit: true });
      cron.schedule("* * * * *", viewingsCron, { runOnInit: true });
      cron.schedule("* * * * *", leadsCron, { runOnInit: true });
      logger.info("✅ Cron jobs scheduled");
    } catch (cronError) {
      logger.error("❌ Error setting up cron jobs:", cronError);
      throw cronError;
    }

    // Graceful shutdown handlers
    const gracefulShutdown = async (signal: string) => {
      logger.info(`\n${signal} received, starting graceful shutdown...`);
      
      server.close(async () => {
        logger.info("🔌 HTTP server closed");
        
        try {
          await client.$disconnect();
          logger.info("✅ Database disconnected");
        } catch (error) {
          logger.error("❌ Error disconnecting from database:", error);
        }
        
        logger.info("✅ Graceful shutdown complete");
        process.exit(0);
      });
    };

    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
    process.on("SIGINT", () => gracefulShutdown("SIGINT"));

  } catch (error) {
    logger.error("");
    logger.error("❌ Failed to start server:");
    logger.error("Error:", JSON.stringify(error, Object.getOwnPropertyNames(error)));
    logger.error("Error message:", error instanceof Error ? error.message : String(error));
    logger.error("Error name:", error instanceof Error ? error.name : "Unknown");
    logger.error("Error stack:", error instanceof Error ? error.stack : "No stack trace available");
    logger.error("Full error object:", error);
    logger.error("");
    
    try {
      await client.$disconnect();
      logger.info("🔌 Database disconnected after error");
    } catch (disconnectError) {
      logger.error("❌ Error disconnecting from database:", disconnectError);
    }
    
    process.exit(1);
  }
}

// Handle uncaught exceptions
process.on("uncaughtException", (error: Error) => {
  logger.error("");
  logger.error("❌ Uncaught Exception:");
  logger.error("Error:", JSON.stringify(error, Object.getOwnPropertyNames(error)));
  logger.error("Error message:", error?.message || "No message");
  logger.error("Error name:", error?.name || "No name");
  logger.error("Error stack:", error?.stack || "No stack");
  logger.error("");
  
  process.exit(1);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason: unknown, promise: Promise<unknown>) => {
  logger.error("");
  logger.error("❌ Unhandled Promise Rejection:");
  logger.error("Reason:", reason);
  if (reason instanceof Error) {
    logger.error("Error message:", reason.message);
    logger.error("Error stack:", reason.stack);
  }
  logger.error("Promise:", promise);
  logger.error("");
  
  process.exit(1);
});

// Start the server
startServer();
