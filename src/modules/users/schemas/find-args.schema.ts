import { z } from "zod";

const schema = z.object({
  page: z.coerce.number().default(1),
  pageSize: z.coerce.number().default(25),
  search: z.string().default(""),
  include: z.string().optional(),
  flat: z.coerce.boolean().optional().default(false),
});

export default schema;
