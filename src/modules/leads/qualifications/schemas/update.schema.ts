import {
  QualificationBuyerType,
  QualificationFinanceType,
} from "@prisma/client";
import { z } from "zod";

const schema = z.object({
  budget: z.number().int().min(1).max(5),
  timeline: z.number().int().min(1).max(5),
  levelOfInterest: z.number().int().min(1).max(5),
  spokenLanguage: z.string(),
  nationalityId: z.string().uuid(),
  customerType: z.enum(["TENANT"]),

  finance: z.nativeEnum(QualificationFinanceType).nullable(),
  buyerType: z.nativeEnum(QualificationBuyerType).nullable(),
});
export default schema;
