import { z } from 'zod';

export const ProfileImageUpdateSchema = z.object({
  image: z.string(),
});

export type ProfileImageInput = z.infer<typeof ProfileImageUpdateSchema>;
