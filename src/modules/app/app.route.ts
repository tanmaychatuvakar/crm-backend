import { Router } from "express";

// routes
import locationsRoute from "../locations/locations.route";
import listingsRoute from "../listings/listings.route";
import contactsRoute from "../contacts/contacts.route";
import photoRequestsRoute from "../photo-requests/photo-requests.route";
import photoshootsRoute from "../photoshoots/photoshoots.route";
import usersRoute from "../users/users.route";
import photoEditorsRoute from "../photo-editors/photo-editors.route";
import photographersRoute from "../photographers/photographers.route";
import extensionRequestsRoute from "../extension-requests/extension-requests.route";
import unpublishRequestsRoute from "../unpublish-requests/unpublish-requests.route";
import authenticationRoute from "../iam/authentication/authentication.route";
import documentsRoute from "../documents/documents.route";
import profileRoute from "../iam/profile/profile.route";
import campaignsRoute from "../campaigns/campaigns.route";
import teamsRoute from "../teams/teams.route";
import webhookRoute from "../webhook/webhook.route";

import feedRoute from "../feed/feed.route";
import leadsRoute from "../leads/leads.route";
import viewingsRoute from "../viewings/viewings.route";
import offersRoute from "../offers/offers.route";
import leadContactsRoute from "../lead-contacts/lead-contacts.route";
import dealsRoute from "../deals/deals.route";

import appController from "./app.controller";

import "express-async-errors";

const router = Router();

router.use("/", locationsRoute); //Todo: cleanup

router.use("/listings", listingsRoute);
router.use("/auth", authenticationRoute);
router.use("/profile", profileRoute);
router.use("/users", usersRoute);
router.use("/contacts", contactsRoute);
router.use("/photo-requests", photoRequestsRoute);
router.use("/photoshoots", photoshootsRoute);
router.use("/photographers", photographersRoute);
router.use("/photo-editors", photoEditorsRoute);
router.use("/extension-requests", extensionRequestsRoute);
router.use("/unpublish-requests", unpublishRequestsRoute);
router.use("/documents", documentsRoute);
router.use("/feed", feedRoute);

router.use("/leads", leadsRoute);
router.use("/viewings", viewingsRoute);
router.use("/offers", offersRoute);
router.use("/lead-contacts", leadContactsRoute);
router.use("/deals", dealsRoute);

router.use("/campaigns", campaignsRoute);
router.use("/teams", teamsRoute);
router.use("/webhook", webhookRoute);

router.use("/common", appController.getCommon);

export default router;
