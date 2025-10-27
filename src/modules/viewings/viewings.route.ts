import authMiddleware from "@/middlewares/auth.middleware";
import validate from "@/middlewares/validate.middleware";
import { Role } from "@prisma/client";
import { Router } from "express";
import findViewingsSchema from "./schemas/find-args.schema";
import viewingsController from "./viewings.controller";

import "express-async-errors";

const router = Router();

router.get(
  "/",
  authMiddleware(Role.AGENT),
  validate.query(findViewingsSchema),
  viewingsController.findAll
);

router.post(
  "/:id/cancel",
  authMiddleware(Role.AGENT),
  viewingsController.cancel
);

export default router;
