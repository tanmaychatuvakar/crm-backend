import { LeadExtensionRequestStatus } from "@prisma/client";
import { z } from "zod";

const schema = z.object({
  page: z.coerce.number().default(1),
  pageSize: z.coerce.number().default(25),
  //   search: z.string().optional(),
  status: z.array(z.nativeEnum(LeadExtensionRequestStatus)).optional(),

  include: z.string().optional(),
});

export default schema;
