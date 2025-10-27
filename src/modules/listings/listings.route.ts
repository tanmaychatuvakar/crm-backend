import { Router } from "express";
import listingsController from "./listings.controller";
import auth from "@/middlewares/auth.middleware";
import validate from "@/middlewares/validate.middleware";
import findArgsSchema from "./schemas/find-args.schema";

import createListingSchema from "./schemas/create.schema";
import publishListingSchema from "./schemas/publish.schema";

import "express-async-errors";
import { Role } from "@prisma/client";

const router = Router();

router.get(
  "/",
  auth(
    Role.AGENT,
    Role.LISTING_DEPARTMENT,
    Role.LINE_MANAGER,
    Role.ADMINISTRATOR
  ),
  validate.query(findArgsSchema),
  listingsController.findAll
);
router.get(
  "/:id",
  auth(Role.AGENT, Role.LISTING_DEPARTMENT),
  listingsController.findOne
);
router.post(
  "/",
  auth(Role.AGENT),
  validate.body(createListingSchema),
  listingsController.create
);
router.put(
  "/:id",
  auth(Role.AGENT),
  validate.body(createListingSchema),
  listingsController.update
);
router.delete("/:id", auth(Role.AGENT), listingsController.destroy);

router.post(
  "/:id/publish",
  auth(Role.LISTING_DEPARTMENT),
  validate.body(publishListingSchema),
  listingsController.publish
);

router.post("/:id/archive", auth(Role.AGENT), listingsController.archive);
router.post("/:id/republish", auth(Role.AGENT), listingsController.republish);

export default router;
