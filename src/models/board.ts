import { z } from 'zod';
import { UserSchema } from '.';

export const BoardSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  image: z.string().nullable(),
  cover: z.string().nullable(),
  visibility: z.union([z.literal('PUBLIC'), z.literal('PRIVATE')]),
  createdAt: z.date(),
  updatedAt: z.date(),
  userId: z.string(),
  owner: UserSchema,
});

export type Board = z.infer<typeof BoardSchema>;

export const BoardCreateSchema = z.object({
  title: z.string(),
  image: z.string().nullable(),
  cover: z.string().nullable(),
  visibility: z.union([z.literal('PRIVATE'), z.literal('PUBLIC')]),
});

export type BoardInput = z.infer<typeof BoardCreateSchema>;
