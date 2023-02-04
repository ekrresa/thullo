import { NextApiRequest, NextApiResponse } from 'next'
import { BoardVisibility } from '@prisma/client'
import { v2 as cloudinary } from 'cloudinary'
import { getServerSession } from 'next-auth'
import nextConnect from 'next-connect'

import { withAuthentication } from '@lib/middleware/with-authentication'
import { authOptions } from '@lib/nextAuthConfig'
import { db } from '@lib/prisma'
import { parseError } from '@lib/utils'
import { BoardCreateSchema } from '@models/index'

const requestHandler = nextConnect<NextApiRequest, NextApiResponse>()

requestHandler.get(async (req, res) => {
  try {
    const session = await getServerSession(req, res, authOptions)

    const userId = session?.user.id

    const whereQuery = userId
      ? {
          OR: [
            { members: { every: { memberId: userId } } },
            { visibility: 'PUBLIC' as BoardVisibility },
          ],
        }
      : { visibility: 'PUBLIC' as BoardVisibility }

    const boards = await db.board.findMany({
      where: whereQuery,
      orderBy: { updatedAt: 'desc' },
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
          select: { isOwner: true, member: { select: { image: true, username: true } } },
        },
      },
    })

    res.status(200).json({ data: boards })
  } catch (error) {
    const message = parseError(error)
    res.status(400).json({ error: message })
  }
})

requestHandler.use(withAuthentication).post(async (req, res) => {
  try {
    const requestBody = BoardCreateSchema.parse(req.body)

    const userId = req.session.user.id

    const existingBoard = await db.board.findFirst({
      where: {
        title: requestBody.title,
        members: { some: { memberId: { equals: userId }, isOwner: { equals: true } } },
      },
      include: {
        members: true,
      },
    })

    if (existingBoard) {
      throw new Error(`Board with ${requestBody.title} already exists`)
    }

    if (requestBody.image) {
      const uploadResponse = await cloudinary.uploader.upload(requestBody.image, {
        folder: 'thullo/boards',
        eager: { aspect_ratio: '16:9', quality: 80 },
      })

      requestBody.image = uploadResponse.secure_url
    }

    const newBoard = await db.board.create({
      data: {
        ...requestBody,
        members: { create: { memberId: userId, role: 'ADMIN', isOwner: true } },
      },
    })

    res.status(200).json({ data: newBoard })
  } catch (error) {
    const message = parseError(error)
    res.status(400).json({ error: message })
  }
})

export default requestHandler

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '4mb',
    },
  },
}
