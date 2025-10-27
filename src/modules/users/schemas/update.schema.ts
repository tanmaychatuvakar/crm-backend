import { Role } from "@prisma/client";
import { z } from "zod";

const schema = z.object({
  name: z.string().optional(),
  phoneNumberCountryCode: z.string().optional().nullable(),
  phoneNumber: z.string().optional().nullable(),
  role: z.nativeEnum(Role).optional(),
  password: z.string().nullish(),
});

export default schema;
