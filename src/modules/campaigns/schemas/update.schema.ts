import { z } from "zod";

const updateCampaignSchema = z.object({
  name: z.string(),
  sourceId: z.string().uuid(),
  teamId: z.string().uuid(),
});
export default updateCampaignSchema;
