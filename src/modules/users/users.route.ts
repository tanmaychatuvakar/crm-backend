import auth from "@/middlewares/auth.middleware";
import validate from "@/middlewares/validate.middleware";
import { Router } from "express";
import usersController from "./users.controller";

import createUserSchema from "./schemas/create.schema";
import updateUserSchema from "./schemas/update.schema";

import "express-async-errors";
import { Role } from "@prisma/client";

const router = Router();

router.get(
  "/",
  auth(Role.ADMINISTRATOR, Role.LISTING_DEPARTMENT),
  usersController.findAll
);
router.post(
  "/",
  auth(Role.ADMINISTRATOR),
  validate.body(createUserSchema),
  usersController.create
);
router.patch(
  "/:id",
  auth(Role.ADMINISTRATOR),
  validate.body(updateUserSchema),
  usersController.update
);
router.patch("/:id/hold", auth(Role.ADMINISTRATOR), usersController.hold);
router.delete("/:id", auth(Role.ADMINISTRATOR), usersController.destroy);

export default router;
