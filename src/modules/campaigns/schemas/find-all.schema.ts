import { z } from "zod";

const findCampaignsSchema = z.object({
  pageSize: z.coerce.number().optional().default(25),
  page: z.coerce.number().optional().default(1),
  q: z.string().optional().default(""),
  include: z.string().optional(),
});
export default findCampaignsSchema;
