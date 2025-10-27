import { z } from 'zod';

const schema = z.object({
  photographerId: z.string().uuid(),
  editorId: z.string().uuid(),
});

export default schema;
