import { z } from "zod";

const updateTeamSchema = z.object({
  name: z.string(),
  users: z.array(z.string().uuid()).min(1),
});
export default updateTeamSchema;
