import { z } from 'zod';

const schema = z.object({
  comments: z.string(),
  listingId: z.string().uuid(),
});

export default schema;
