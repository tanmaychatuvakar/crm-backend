import { Router } from "express";

import validate from "@/middlewares/validate.middleware";

import "express-async-errors";
import auth from "@/middlewares/auth.middleware";
import updateFeedbackSchema from "./schemas/update.schema";
import { Role } from "@prisma/client";
import feedbackController from "./feedback.controller";

const router = Router({ mergeParams: true });

router.put(
  "/",
  auth(Role.AGENT),
  validate.body(updateFeedbackSchema),
  feedbackController.update
);

export default router;
