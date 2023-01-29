import { Prisma } from '@prisma/client'
import { z } from 'zod'

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
})

export const UserProfileInputSchema = z.object({
  image: z.string().trim().optional(),
  username: z
    .string()
    .trim()
    .min(2, 'Username must have at least 2 characters')
    .max(20, 'Username must be less than 20 characters')
    .optional(),
  name: z.string().trim().optional(),
})

export type UserProfileInput = z.infer<typeof UserProfileInputSchema>

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
})

export type User = Prisma.UserGetPayload<typeof user>
