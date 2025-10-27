import { z } from 'zod';

const schema = z.object({
  rejectionReason: z.string(),
});

export default schema;
