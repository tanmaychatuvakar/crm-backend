import { z } from "zod";

const schema = z.object({
  scheduledAt: z.coerce.date().nullable(),
  listingId: z.string().uuid(),
  occupancy: z.string().nullable(),
  keyLocation: z.string(),
  buildingAccessCardLocation: z.string(),
  parkingAccessCardLocation: z.string().nullable(),
  comments: z.string().nullable(),
  isBrokerPresent: z.boolean(),
});

export default schema;
