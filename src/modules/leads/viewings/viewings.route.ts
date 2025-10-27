import { Role } from "@prisma/client";
import { Router } from "express";
import viewingsController from "./viewings.controller";
import validate from "@/middlewares/validate.middleware";
import auth from "@/middlewares/auth.middleware";
import createViewingSchema from "./schemas/create.schema";

import feedbacksRoute from "./feedback/feedback.route";

import "express-async-errors";

const router = Router({ mergeParams: true });

router.post(
  "/",
  auth(Role.AGENT),
  validate.body(createViewingSchema),
  viewingsController.create
);

router.use("/:id/feedback", feedbacksRoute);

export default router;
