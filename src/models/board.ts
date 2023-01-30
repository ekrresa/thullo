import { Prisma } from '@prisma/client'
import { z } from 'zod'

import { UserSchema } from '.'

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
})

export type Board = z.infer<typeof BoardSchema>

export const BoardCreateSchema = z.object({
  title: z.string(),
  slug: z.string().trim().default(''),
  image: z.string().nullable(),
  cover: z.string().nullable(),
  visibility: z.union([z.literal('PRIVATE'), z.literal('PUBLIC')]),
})

export type BoardInput = z.infer<typeof BoardCreateSchema>

export const BoardUpdateSchema = z.object({
  title: z.string().optional(),
  image: z.string().optional(),
  cover: z.string().optional(),
  description: z.string().optional(),
  visibility: z.union([z.literal('PRIVATE'), z.literal('PUBLIC')]).optional(),
})

export type BoardUpdate = z.infer<typeof BoardUpdateSchema>

const boardListWithMembers = Prisma.validator<Prisma.BoardArgs>()({
  select: {
    id: true,
    cover: true,
    image: true,
    description: true,
    title: true,
    slug: true,
    visibility: true,
    updatedAt: true,
    members: {
      select: {
        isOwner: true,
        member: { select: { image: true, name: true, username: true } },
      },
    },
  },
})

const boardWithMembers = Prisma.validator<Prisma.BoardArgs>()({
  select: {
    id: true,
    cover: true,
    image: true,
    description: true,
    title: true,
    visibility: true,
    updatedAt: true,
    createdAt: true,
    members: {
      select: {
        role: true,
        isOwner: true,
        memberId: true,
        createdAt: true,
        member: { select: { image: true, name: true, username: true } },
      },
    },
  },
})

export type BoardWithMembers = Prisma.BoardGetPayload<typeof boardWithMembers>

export type BoardListWithMembers = Prisma.BoardGetPayload<typeof boardListWithMembers>

export const BoardListWithMembersSchema: z.ZodType<BoardListWithMembers> = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  description: z.string().nullable(),
  image: z.string().nullable(),
  cover: z.string().nullable(),
  visibility: z.union([z.literal('PUBLIC'), z.literal('PRIVATE')]),
  updatedAt: z.date(),
  members: z.array(
    z.object({
      isOwner: z.boolean(),
      member: z.object({
        image: z.string().nullable(),
        name: z.string().nullable(),
        username: z.string().nullable(),
      }),
    })
  ),
})
