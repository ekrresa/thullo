import { z } from 'zod';

export const BoardCreateSchema = z.object({
  title: z.string(),
  image: z.string().nullable(),
  cover: z.string().nullable(),
  visibility: z.union([z.literal('PRIVATE'), z.literal('PUBLIC')]),
});

export type BoardInput = z.infer<typeof BoardCreateSchema>;
