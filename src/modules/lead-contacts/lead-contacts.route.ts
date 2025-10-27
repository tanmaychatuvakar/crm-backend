import authMiddleware from "@/middlewares/auth.middleware";
import validate from "@/middlewares/validate.middleware";
import { Role } from "@prisma/client";
import { Router } from "express";
import findLeadContactsSchema from "./schemas/find-args.schema";
import leadContactsController from "./lead-contacts.controller";

import "express-async-errors";

const router = Router();

router.get(
  "/",
  authMiddleware(Role.AGENT),
  validate.query(findLeadContactsSchema),
  leadContactsController.findAll
);

export default router;
