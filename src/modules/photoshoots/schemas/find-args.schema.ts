import { PhotoshootStatus } from '@prisma/client';
import { z } from 'zod';

const schema = z.object({
  page: z.coerce.number().default(1),
  pageSize: z.coerce.number().default(25),
  status: z.array(z.nativeEnum(PhotoshootStatus)).optional(),
  include: z.string().optional(),
});

export default schema;
