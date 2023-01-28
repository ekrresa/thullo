import { Prisma } from '@prisma/client';
import { z } from 'zod';

export const UserSchema = z.object({
  id: z.string(),
  name: z.string().nullable(),
  email: z.string(),
  emailVerified: z.date(),
  username: z.string().nullable(),
  image: z.string().nullable(),
  isGuest: z.boolean(),
  isProfileSetup: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const ProfileImageUpdateSchema = z.object({
  image: z.string(),
});

export type ProfileImageInput = z.infer<typeof ProfileImageUpdateSchema>;

export const UserProfileInputSchema = z.object({
  username: z.string().trim().max(50, 'Username must be less than 50 characters'),
  name: z.string().trim(),
});

export type UserProfileInput = z.infer<typeof UserProfileInputSchema>;

const user = Prisma.validator<Prisma.UserArgs>()({
  select: {
    id: true,
    name: true,
    email: true,
    username: true,
    image: true,
    isGuest: true,
    isProfileSetup: true,
  },
});

export type User = Prisma.UserGetPayload<typeof user>;
