import { z } from "zod";

const schema = z.object({
  assignTo: z.enum(["PHOTOGRAPHER", "EDITOR"]),
  rejectionReason: z.string(),
});

export default schema;
