import { Router } from "express";
import { Role } from "@prisma/client";
import validate from "@/middlewares/validate.middleware";
import auth from "@/middlewares/auth.middleware";
import leadsController from "./leads.controller";
import createLeadSchema from "./schemas/create.schema";
import findArgsSchema from "./schemas/find-args.schema";
import updateQualificationSchema from "./qualifications/schemas/update.schema";

import extensionRequestsRoute from "./extension-requests/extension-requests.route";

import createOfferSchema from "./offers/schemas/create.schema";

import "express-async-errors";

import viewingsRoute from "./viewings/viewings.route";

import qualificationsController from "./qualifications/qualifications.controller";

import updateContactSchema from "./contacts/schemas/update.schema";
import rejectLeadSchema from "./schemas/reject.schema";

const router = Router();

router.get(
  "/",
  auth(Role.AGENT, Role.LINE_MANAGER),
  validate.query(findArgsSchema),
  leadsController.findAll
);

router.get(
  "/pool",
  auth(Role.AGENT),
  validate.query(findArgsSchema),
  leadsController.pool
);

router.patch("/pool/:id/pick-up", auth(Role.AGENT), leadsController.pickUp);

router.post(
  "/",
  auth(Role.AGENT),
  validate.body(createLeadSchema),
  leadsController.create
);

/**
 * Extension Requests
 */
router.use("/extension-requests", extensionRequestsRoute);

router.get("/:id", auth(Role.AGENT), leadsController.findOne);
router.post("/:id/approve", auth(Role.LINE_MANAGER), leadsController.approve);
router.post(
  "/:id/reject",
  auth(Role.LINE_MANAGER),
  validate.body(rejectLeadSchema),
  leadsController.reject
);

/**
 * Viewings
 */

router.use("/:id/viewings", viewingsRoute);

/**
 * Qualification
 */

router.put(
  "/:id/qualification",
  auth(Role.AGENT),
  validate.body(updateQualificationSchema),
  qualificationsController.update
);

/**
 * Offers
 */

router.post(
  "/:id/offers",
  auth(Role.AGENT),
  validate.body(createOfferSchema),
  leadsController.offers.create
);

router.post("/:leadId/offers/:offerId/convert", leadsController.offers.convert);
router.post("/:leadId/offers/:offerId/accept", leadsController.offers.accept);
router.post("/:leadId/offers/:offerId/reject", leadsController.offers.reject);
router.post(
  "/:leadId/offers/:offerId/negotiate",
  leadsController.offers.negotiate
);

/**
 * Contact
 */
router.patch(
  "/:id/contact",
  validate.body(updateContactSchema),
  leadsController.contact.update
);

export default router;
