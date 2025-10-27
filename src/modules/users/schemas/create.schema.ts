import { Role } from "@prisma/client";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  name: z.string(),
  password: z.string(),
  phoneNumberCountryCode: z.string().nullable(),
  phoneNumber: z.string().nullable(),
  role: z.nativeEnum(Role),
});

export default schema;
