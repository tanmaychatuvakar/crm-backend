import auth from "@/middlewares/auth.middleware";
import validate from "@/middlewares/validate.middleware";
import { Router } from "express";
import unpublishRequestsController from "./unpublish-requests.controller";
import createUnpublishRequestSchema from "./schemas/create.schema";
import findArgsSchema from "./schemas/find-args.schema";

import "express-async-errors";
import { Role } from "@prisma/client";

const router = Router();

router.get(
  "/",
  auth(Role.AGENT, Role.LISTING_DEPARTMENT),
  validate.query(findArgsSchema),
  unpublishRequestsController.findAll
);
router.get(
  "/:id",
  auth(Role.LISTING_DEPARTMENT),
  unpublishRequestsController.findOne
);

router.post(
  "/",
  auth(Role.AGENT),
  validate.body(createUnpublishRequestSchema),
  unpublishRequestsController.create
);
router.post(
  "/:id/cancel",
  auth(Role.AGENT),
  unpublishRequestsController.cancel
);

router.post(
  "/:id/approve",
  auth(Role.LISTING_DEPARTMENT),
  unpublishRequestsController.approve
);
router.post(
  "/:id/reject",
  auth(Role.LISTING_DEPARTMENT),
  unpublishRequestsController.reject
);
export default router;
