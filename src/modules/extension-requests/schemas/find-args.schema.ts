import { ExtensionRequestStatus } from '@prisma/client';
import { z } from 'zod';

const schema = z.object({
  page: z.coerce.number().default(1),
  pageSize: z.coerce.number().default(25),
  status: z.array(z.nativeEnum(ExtensionRequestStatus)).optional(),
  isSale: z.coerce.boolean().optional(),
  isRental: z.coerce.boolean().optional(),
  include: z.string().optional(),
});

export default schema;
