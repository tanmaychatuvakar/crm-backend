import { ListingStatus } from '@prisma/client';
import { z } from 'zod';

const schema = z.object({
  page: z.coerce.number().default(1),
  pageSize: z.coerce.number().default(25),
  search: z.string().optional(),
  status: z.array(z.nativeEnum(ListingStatus)).optional(),
  isExclusive: z.coerce.boolean().optional(),
  isSale: z.coerce.boolean().optional(),
  isRental: z.coerce.boolean().optional(),
  include: z.string().optional(),
});

export default schema;
