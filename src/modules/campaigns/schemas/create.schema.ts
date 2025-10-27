import { z } from "zod";

const createCampaignSchema = z.object({
  name: z.string(),
  sourceId: z.string().uuid(),
  teamId: z.string().uuid(),
});

export default createCampaignSchema;
