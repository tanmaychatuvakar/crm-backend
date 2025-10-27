import { Router } from "express";
import auth from "@/middlewares/auth.middleware";
import validate from "@/middlewares/validate.middleware";
import updatePasswordSchema from "./schemas/update-password.schema";
import profileController from "./profile.controller";

import "express-async-errors";
import upload from "@/middlewares/upload.middleware";

const router = Router();

router.get("/", auth(), profileController.getProfile);
router.patch(
  "/password",
  auth(),
  validate.body(updatePasswordSchema),
  profileController.updatePassword
);
router.patch(
  "/image",
  auth(),
  upload("user-images").single("file"),
  profileController.updateImage
);

router.put("/", auth(), profileController.update);

export default router;
