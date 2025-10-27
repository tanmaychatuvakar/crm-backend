import { z } from "zod";

const schema = z.object({
  community: z.number().int().min(1).max(5),
  location: z.number().int().min(1).max(5),
  floor: z.number().int().min(1).max(5),
  view: z.number().int().min(1).max(5),
  floorPlanLayout: z.number().int().min(1).max(5),
  area: z.number().int().min(1).max(5),
  condition: z.number().int().min(1).max(5),
  price: z.number().int().min(1).max(5),
  amenities: z.number().int().min(1).max(5),
  parking: z.number().int().min(1).max(5),
  acType: z.number().int().min(1).max(5),

  serviceCharge: z.number().int().min(1).max(5).nullable(),
  furnitureCondition: z.number().int().min(1).max(5).nullable(),
  appliancesCondition: z.number().int().min(1).max(5).nullable(),
});
export default schema;
