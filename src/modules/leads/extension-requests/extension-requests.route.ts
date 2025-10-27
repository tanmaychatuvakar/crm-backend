import { Router } from "express";
import { Role } from "@prisma/client";
import auth from "@middlewares/auth.middleware";
import validate from "@middlewares/validate.middleware";
import extensionRequestsController from "./extension-requests.controller";

import findArgsSchema from "./schemas/find-args.schema";
import createExtensionRequestSchema from "./schemas/create.schema";

import "express-async-errors";

const router = Router();

router.get(
  "/",
  auth(Role.AGENT, Role.LINE_MANAGER),
  validate.query(findArgsSchema),
  extensionRequestsController.findAll
);

router.post(
  "/",
  auth(Role.AGENT),
  validate.body(createExtensionRequestSchema),
  extensionRequestsController.create
);

router.post(
  "/:id/approve",
  auth(Role.LINE_MANAGER),
  extensionRequestsController.approve
);
router.post(
  "/:id/reject",
  auth(Role.LINE_MANAGER),
  extensionRequestsController.reject
);

export default router;
