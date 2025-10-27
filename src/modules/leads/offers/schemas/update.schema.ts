import { z } from "zod";

const schema = z.object({
  viewingId: z.string().uuid().optional(),
  price: z.number().int().optional(),
});
export default schema;
