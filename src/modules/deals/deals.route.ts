import { Router } from "express";
import dealsController from "./deals.controller";
import authMiddleware from "@/middlewares/auth.middleware";
import { Role } from "@prisma/client";
import validate from "@/middlewares/validate.middleware";
import findArgsSchema from "./schemas/find-args.schema";

const router = Router();

router.get(
  "/",
  authMiddleware(Role.AGENT),
  validate.query(findArgsSchema),
  dealsController.findAll
);

export default router;
