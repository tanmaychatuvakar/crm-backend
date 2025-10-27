import { z } from "zod";

const schema = z.object({
  name: z.string(),
  phoneNumber: z.string().nullable(),
});

export default schema;
