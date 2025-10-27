import { UnprocessableContentException } from "@/exceptions/http/unprocessable-content.exception";
import { Request, Response } from "express";
import { z } from "zod";
import invokeWebhookSchema from "./schemas/invoke.schema";
import webhookService from "./webhook.service";

const invoke = async (
  req: Request<
    any,
    any,
    z.infer<typeof invokeWebhookSchema>,
    { campaignId?: string }
  >,
  res: Response
) => {
  const campaignId = req.query.campaignId;
  if (!campaignId) {
    throw new UnprocessableContentException("campaignId is required");
  }

  await webhookService.invoke(campaignId, req.body);

  res.sendStatus(200);
};

export default { invoke };
