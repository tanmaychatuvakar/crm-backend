import { Router } from "express";
import photoRequestsController from "./photo-requests.controller";
import auth from "@/middlewares/auth.middleware";
import validate from "@/middlewares/validate.middleware";

import findArgsSchema from "./schemas/find-args.schema";
import createPhotoRequestSchema from "./schemas/create.schema";
import rejectPhotoRequestSchema from "./schemas/reject.schema";

import "express-async-errors";
import { Role } from "@prisma/client";

const router = Router();

router.get(
  "/",
  auth(Role.AGENT, Role.LISTING_DEPARTMENT, Role.ADMINISTRATOR),

  validate.query(findArgsSchema),
  photoRequestsController.findAll
);
router.get(
  "/:id",
  auth(Role.LISTING_DEPARTMENT),
  photoRequestsController.findOne
);
router.post(
  "/",
  auth(Role.AGENT),
  validate.body(createPhotoRequestSchema),
  photoRequestsController.create
);

/**Status */
router.post("/:id/cancel", auth(Role.AGENT), photoRequestsController.cancel);

router.post(
  "/:id/approve",
  auth(Role.LISTING_DEPARTMENT),
  photoRequestsController.approve
);
router.post(
  "/:id/reject",
  auth(Role.LISTING_DEPARTMENT),
  validate.body(rejectPhotoRequestSchema),
  photoRequestsController.reject
);
//
export default router;
