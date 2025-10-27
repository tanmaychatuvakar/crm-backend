import authMiddleware from "@/middlewares/auth.middleware";
import validate from "@/middlewares/validate.middleware";
import { Router } from "express";
import findTeamsSchema from "./schemas/find-all.schema";
import teamsController from "./teams.controller";
import createTeamSchema from "./schemas/create.schema";
import { Role } from "@prisma/client";
import updateTeamSchema from "./schemas/update.schema";

const router = Router();

router.get(
  "/",
  authMiddleware(Role.LISTING_DEPARTMENT),
  validate.query(findTeamsSchema),
  teamsController.findAll
);

router.get(
  "/:id",
  authMiddleware(Role.LISTING_DEPARTMENT),
  teamsController.findOne
);

router.post(
  "/",
  authMiddleware(Role.LISTING_DEPARTMENT),
  validate.body(createTeamSchema),
  teamsController.create
);

router.put(
  "/:id",
  authMiddleware(Role.LISTING_DEPARTMENT),
  validate.body(updateTeamSchema),
  teamsController.update
);

router.delete(
  "/:id",
  authMiddleware(Role.LISTING_DEPARTMENT),
  teamsController.destroy
);

export default router;
