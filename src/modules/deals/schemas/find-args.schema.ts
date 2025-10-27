import { z } from "zod";

const schema = z.object({
  page: z.coerce.number().default(1),
  pageSize: z.coerce.number().default(25),
  include: z.string().optional(),
});

export default schema;
