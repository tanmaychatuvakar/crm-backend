import { PORT, LOG_FORMAT, ORIGIN, CREDENTIALS, NODE_ENV, DB_ADDRESS, DB_NAME, DB_USER, JWT_SECRET } from "@config";
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

// Validate environment variables
function validateEnvironment() {
  const requiredVars = {
    NODE_ENV: NODE_ENV,
    DB_ADDRESS: DB_ADDRESS,
    DB_NAME: DB_NAME,
    DB_USER: DB_USER,
    JWT_SECRET: JWT_SECRET,
  };

  const missingVars: string[] = [];
  
  for (const [key, value] of Object.entries(requiredVars)) {
    if (!value || value === "") {
      missingVars.push(key);
    }
  }

  if (missingVars.length > 0) {
    logger.error("❌ Missing required environment variables:");
    missingVars.forEach(vars => logger.error(`   - ${vars}`));
    logger.error("");
    logger.error("Please check your .env file and ensure all required variables are set.");
    process.exit(1);
  }
}

const app = express();

app.use(morgan(LOG_FORMAT, { stream }));

// Configure CORS - ALLOW ALL ORIGINS
// ⚠️ WARNING: This allows ANY website to access your API
// For production, restrict this to specific origins only!
const corsOptions = {
  origin: true, // Allow ALL origins (reflects the request's origin)
  credentials: true, // Allow credentials (cookies, auth headers)
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type", 
    "Authorization", 
    "X-Requested-With", 
    "Cookie",
    "ngrok-skip-browser-warning",
    "X-Forwarded-For",
    "X-Forwarded-Proto",
    "X-Forwarded-Host",
  ],
  exposedHeaders: ["Authorization"],
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
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
    // Validate environment variables
    logger.info("🔍 Validating environment variables...");
    validateEnvironment();
    logger.info("✅ Environment variables validated");
    logger.info("");
    
    // Log environment info
    logger.info("🌍 Environment Information:");
    logger.info(`   Environment: ${NODE_ENV}`);
    logger.info(`   Database: ${DB_ADDRESS}`);
    logger.info(`   Port: ${PORT}`);
    logger.info("");
    
    // Test database connection
    logger.info("🔌 Testing database connection...");
    await client.$connect();
    logger.info("✅ Database connected successfully!");
    logger.info("");

    // Start the server
    logger.info(`🔌 Starting HTTP server on port ${port}...`);
    const server = app.listen(port, () => {
      logger.info(`[${NODE_ENV}] Server listening on port ${PORT} 🚀`);
      logger.info(`📃 Docs available on http://localhost:${PORT}/api-docs`);
      logger.info("");
    });

    // Handle server errors
    server.on('error', (err: Error) => {
      logger.error('❌ Server error:', err);
      logger.error('Error code:', (err as any).code);
      logger.error('Error message:', err.message);
      throw err;
    });

    // Setup cron jobs
    try {
      logger.info("⏰ Setting up cron jobs...");
      
      // Wrap cron jobs to catch errors
      const safeCronWrapper = (job: any, name: string) => {
        return async (...args: any[]) => {
          try {
            await job(...args);
          } catch (error) {
            logger.error(`❌ Error in ${name} cron:`, error);
          }
        };
      };
      
      cron.schedule("* * * * *", safeCronWrapper(listingsCron, "listings"), { runOnInit: true });
      cron.schedule("* * * * *", safeCronWrapper(viewingsCron, "viewings"), { runOnInit: true });
      cron.schedule("* * * * *", safeCronWrapper(leadsCron, "leads"), { runOnInit: true });
      logger.info("✅ Cron jobs scheduled");
    } catch (cronError) {
      logger.error("❌ Error setting up cron jobs:", cronError);
      throw cronError;
    }

    logger.info("🎉 Server initialization complete!");
    logger.info("🚀 Attempting to start HTTP server...");
    
    try {
      // Setup graceful shutdown for this server instance
      logger.info("Setting up graceful shutdown handlers...");
      const setupGracefulShutdown = (serverInstance: any) => {
        const gracefulShutdown = async (signal: string) => {
          logger.info(`\n${signal} received, starting graceful shutdown...`);
          
          serverInstance.close(async () => {
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

        process.once("SIGTERM", () => gracefulShutdown("SIGTERM"));
        process.once("SIGINT", () => gracefulShutdown("SIGINT"));
      };
      
      setupGracefulShutdown(server);
      logger.info("✅ Graceful shutdown handlers set up");
      logger.info("✅ Server setup complete - waiting for requests...");
    } catch (setupError) {
      logger.error("❌ Error setting up graceful shutdown:", setupError);
      throw setupError;
    }

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
  logger.error("Error type:", typeof error);
  logger.error("Error constructor:", error?.constructor?.name || "Unknown");
  logger.error("Error keys:", Object.keys(error || {}));
  logger.error("Error message:", error?.message || "No message");
  logger.error("Error name:", error?.name || "No name");
  logger.error("Error stack:", error?.stack || "No stack");
  logger.error("Error toString:", String(error));
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
