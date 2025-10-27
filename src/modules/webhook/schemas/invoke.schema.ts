import { z } from "zod";

const invokeWebhookSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  phoneNumber: z.string(),
});
export default invokeWebhookSchema;
