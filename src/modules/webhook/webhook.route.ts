import validate from "@/middlewares/validate.middleware";
import { Router } from "express";
import invokeWebhookSchema from "./schemas/invoke.schema";
import basicAuth from "express-basic-auth";
import webhookController from "./webhook.controller";

const router = Router();

router.post(
  "/",
  basicAuth({ users: { dubaiplatform: "dubaiplatform123@" } }),
  validate.body(invokeWebhookSchema),
  webhookController.invoke
);

export default router;
