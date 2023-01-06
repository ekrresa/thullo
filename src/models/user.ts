import { z } from 'zod';

export const ProfileImageUpdateSchema = z.object({
  image: z.string(),
});

export type ProfileImageInput = z.infer<typeof ProfileImageUpdateSchema>;

export const UserProfileInputSchema = z.object({
  username: z.string().trim().max(50, 'Username must be less than 50 characters'),
  name: z.string().trim(),
});

export type UserProfileInput = z.infer<typeof UserProfileInputSchema>;
