import { z } from "zod";

const schema = z.object({
  viewingId: z.string().uuid(),
  price: z.number().int(),
  cheques: z.number().int().nullable(),
  offeredAt: z.coerce.date(),
});
export default schema;
