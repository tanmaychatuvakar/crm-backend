import { PhotoRequestStatus } from '@prisma/client';
import { z } from 'zod';

const schema = z.object({
  status: z.nativeEnum(PhotoRequestStatus),
});

export default schema;
