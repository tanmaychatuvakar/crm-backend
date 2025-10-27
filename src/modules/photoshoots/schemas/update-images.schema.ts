import { z } from 'zod';

const schema = z.object({
  photographerImages: z.array(z.object({ objectKey: z.string() })).optional(),
  editorImages: z.array(z.object({ objectKey: z.string() })).optional(),
});

export default schema;
