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

app.listen(port, () => {
  logger.info(`[${NODE_ENV}] Server listening on port ${PORT} 🚀`);
});

cron.schedule("* * * * *", listingsCron, { runOnInit: true });
cron.schedule("* * * * *", viewingsCron, { runOnInit: true });
cron.schedule("* * * * *", leadsCron, { runOnInit: true });
