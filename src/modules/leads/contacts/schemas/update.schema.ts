import { LeadContactChannel, LeadContactResponse } from "@prisma/client";
import { z } from "zod";

const schema = z.object({
  contactable: z.boolean().optional(),
  channel: z.nativeEnum(LeadContactChannel).optional(),
  response: z.nativeEnum(LeadContactResponse).optional(),
});
export default schema;
