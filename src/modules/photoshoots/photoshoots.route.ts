import { Router } from "express";
import auth from "@/middlewares/auth.middleware";
import validate from "@/middlewares/validate.middleware";
import photoshootsController from "./photoshoots.controller";
import assignPhotoshootSchema from "./schemas/assign.schema";
import reAssignPhotoshootSchema from "./schemas/re-assign.schema";

import findArgsSchema from "./schemas/find-args.schema";

import "express-async-errors";
import upload from "@/middlewares/upload.middleware";
import { Role } from "@prisma/client";

const router = Router();

router.get(
  "/",
  auth(),
  validate.query(findArgsSchema),
  photoshootsController.findAll
);
router.post(
  "/:id/re-assign",
  auth(Role.LISTING_DEPARTMENT),
  validate.body(reAssignPhotoshootSchema),
  photoshootsController.reAssign
);
router.post(
  "/:id/assign",
  auth(),
  validate.body(assignPhotoshootSchema),
  photoshootsController.assign
);

router.post(
  "/:id/submit",
  auth(Role.PHOTOGRAPHER, Role.EDITOR),
  photoshootsController.submit
);
router.post(
  "/:id/approve",
  auth(Role.LISTING_DEPARTMENT),
  photoshootsController.approve
);

router.post(
  "/:id/upload",
  auth(Role.PHOTOGRAPHER, Role.EDITOR),
  upload("listings/images").array("files"),
  photoshootsController.upload
);

router.delete(
  "/:photoshootId/images/:imageId",
  auth(Role.PHOTOGRAPHER, Role.EDITOR),
  photoshootsController.deleteImage
);

export default router;
