import { z } from "zod";

const rejectLeadSchema = z.object({
  rejectionReason: z.string().min(1),
});
export default rejectLeadSchema;
