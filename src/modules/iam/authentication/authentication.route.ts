import validate from "@/middlewares/validate.middleware";
import { Router } from "express";
import authenticationController from "./authentication.controller";
import signInSchema from "./schemas/sign-in.schema";

import "express-async-errors";

const router = Router();

router.post(
  "/sign-in",
  validate.body(signInSchema),
  authenticationController.signIn
);
router.post("/logout", authenticationController.logout);

export default router;
