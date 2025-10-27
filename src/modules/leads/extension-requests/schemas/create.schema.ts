import { z } from "zod";

const schema = z.object({
  reason: z.string(),
  leadId: z.string().uuid(),
});
export default schema;
