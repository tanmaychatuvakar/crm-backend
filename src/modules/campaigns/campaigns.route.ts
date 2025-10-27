import authMiddleware from "@/middlewares/auth.middleware";
import validate from "@/middlewares/validate.middleware";
import { Router } from "express";

import "express-async-errors";
import createCampaignSchema from "./schemas/create.schema";
import campaignsController from "./campaigns.controller";
import { Role } from "@prisma/client";
import findCampaignsSchema from "./schemas/find-all.schema";
import updateCampaignSchema from "./schemas/update.schema";

const router = Router();

router.get(
  "/",
  authMiddleware(),
  validate.query(findCampaignsSchema),
  campaignsController.findAll
);

router.get("/:id", authMiddleware(), campaignsController.findOne);

router.post(
  "/",
  authMiddleware(Role.LISTING_DEPARTMENT),
  validate.body(createCampaignSchema),
  campaignsController.create
);

router.put(
  "/:id",
  authMiddleware(Role.LISTING_DEPARTMENT),
  validate.body(updateCampaignSchema),
  campaignsController.update
);

router.delete(
  "/:id",
  authMiddleware(Role.LISTING_DEPARTMENT),
  campaignsController.destroy
);

export default router;
