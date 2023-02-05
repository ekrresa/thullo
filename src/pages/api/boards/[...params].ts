import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import nextConnect from 'next-connect'

import { withAuthentication } from '@lib/middleware/with-authentication'
import { authOptions } from '@lib/nextAuthConfig'
import { db } from '@lib/prisma'
import { parseError } from '@lib/utils'
import { BoardUpdateSchema } from '@models/index'

const handler = nextConnect<NextApiRequest, NextApiResponse>()

handler.get(async (req, res) => {
  try {
    const [username, slug] = req.query.params as string[]

    const board = await db.board.findFirst({
      where: {
        slug,
        members: { every: { member: { username: { equals: username } } } },
      },
      include: {
        members: { include: { member: true } },
      },
    })

    if (!board) {
      throw new Error(`Board does not exist.`)
    }

    if (board.visibility === 'PRIVATE') {
      const session = await getServerSession(req, res, authOptions)

      if (!session) {
        throw new Error(`Board does not exist.`)
      }

      const isBoardMember = board.members.some(
        member => member.memberId === session.user.id
      )

      if (!isBoardMember) {
        throw new Error(`Board does not exist.`)
      }
    }

    res.status(200).json(board)
  } catch (error) {
    const message = parseError(error)
    res.status(400).json({ error: message })
  }
})

handler.use(withAuthentication).put(async (req, res) => {
  try {
    const userId = req.session.user.id
    const [boardId] = req.query.params as string[]
    const input = BoardUpdateSchema.parse(req.body)

    const board = await db.board.update({
      where: {
        id: boardId,
        // members: {
        //   every: { memberId: { equals: userId }, isOwner: { equals: true } },
        // },
      },
      data: input,
    })

    res.status(200).json(board)
  } catch (error) {
    const message = parseError(error)
    res.status(400).json({ error: message })
  }
})

export default handler
