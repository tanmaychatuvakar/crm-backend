import { LeadContactType } from "@prisma/client";
import { z } from "zod";

const createLeadSchema = z.object({
  title: z.enum(["Mr.", "Mrs."]),
  name: z.string(),
  mobileNumber: z.string(),
  phoneNumber: z.string().nullable(),
  email: z.string().email().nullable(),
  nationalityId: z.string().uuid().nullable(),
  language: z.string(),
  sourceId: z.string().nullable(),
  subsource: z.string().nullable(),
  type: z.nativeEnum(LeadContactType),
  //
  listingId: z.string().uuid(),

  //--- Preference
  cityId: z.string().uuid(),
  communityId: z.string().uuid().nullable(),
  subcommunityId: z.string().uuid().nullable(),
  propertyId: z.string().uuid().nullable(),
  categoryId: z.string().uuid(),

  minBedrooms: z.number(),
  maxBedrooms: z.number(),
  minPrice: z.number(),
  maxPrice: z.number(),
  minArea: z.number(),
  maxArea: z.number(),
});

export default createLeadSchema;
