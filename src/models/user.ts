import { z } from 'zod';

export const UserSchema = z.object({
  id: z.string(),
  name: z.string().nullable(),
  email: z.string(),
  username: z.string().nullable(),
  image: z.string().nullable(),
  isGuest: z.boolean(),
  createdAt: z.preprocess(arg => {
    if (typeof arg == 'string' || arg instanceof Date) return new Date(arg);
  }, z.date()),
  updatedAt: z.preprocess(arg => {
    if (typeof arg == 'string' || arg instanceof Date) return new Date(arg);
  }, z.date()),
});

export type User = z.infer<typeof UserSchema>;

export const ProfileImageUpdateSchema = z.object({
  image: z.string(),
});

export type ProfileImageInput = z.infer<typeof ProfileImageUpdateSchema>;

export const UserProfileInputSchema = z.object({
  username: z.string().trim().max(50, 'Username must be less than 50 characters'),
  name: z.string().trim(),
});

export type UserProfileInput = z.infer<typeof UserProfileInputSchema>;
