import { FurnishedStatus } from "@prisma/client";
import { z } from "zod";

const schema = z.union([
  z.object({
    scheduledAt: z.coerce.date(),
    listingId: z.undefined(),
    listing: z.object({
      type: z.enum(["SALE", "RENTAL"]),
      numberOfBedrooms: z.coerce.number().int(),
      numberOfBathrooms: z.coerce.number().int(),
      furnished: z.nativeEnum(FurnishedStatus),
      price: z.number().int(),
      categoryId: z.string().uuid(),
      cityId: z.string().uuid(),
      communityId: z.string().uuid(),
      subcommunityId: z.string().uuid().optional(),
      propertyId: z.string().uuid().optional(),
    }),
  }),
  z.object({
    scheduledAt: z.coerce.date(),
    listingId: z.string().uuid(),
    listing: z.undefined(),
  }),
]);
export default schema;
