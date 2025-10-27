import authMiddleware from "@/middlewares/auth.middleware";
import validate from "@/middlewares/validate.middleware";
import { Role } from "@prisma/client";
import { Router } from "express";
import findOfferSchema from "./schemas/find-args.schema";
import offersController from "./offers.controller";

import "express-async-errors";

const router = Router();

router.get(
  "/",
  authMiddleware(Role.AGENT),
  validate.query(findOfferSchema),
  offersController.findAll
);

export default router;
