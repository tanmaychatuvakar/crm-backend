import { z } from 'zod';

const schema = z.object({
  listingId: z.string().uuid(),
  comments: z.string(),
});

export default schema;
