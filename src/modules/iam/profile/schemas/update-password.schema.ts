import { z } from "zod";

const schema = z.object({
  currentPassword: z.string(),
  newPassword: z.string(),
});
export default schema;
