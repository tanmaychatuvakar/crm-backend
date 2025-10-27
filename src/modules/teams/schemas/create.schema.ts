import { z } from "zod";

const createTeamSchema = z.object({
  name: z.string(),
  users: z.array(z.string().uuid()).min(1),
});
export default createTeamSchema;
