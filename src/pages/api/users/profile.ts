import { NextApiRequest, NextApiResponse } from 'next'
import { v2 as cloudinary } from 'cloudinary'
import nextConnect from 'next-connect'

import { withAuthentication } from '@lib/middleware/with-authentication'
import { db } from '@lib/prisma'
import { UserProfileInputSchema } from '@models/user'

const handler = nextConnect()

handler.use(withAuthentication).get(async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const userId = req.session.user.id

    const user = await db.user.findFirst({
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        image: true,
        isGuest: true,
        isProfileSetup: true,
      },
      where: { id: userId },
    })

    res.status(200).json(user)
  } catch (error) {
    res.status(400).json({
      error: 'Error fetching user profile',
    })
  }
})

handler
  .use(withAuthentication)
  .post(async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const userId = req.session.user.id
      const requestBody = UserProfileInputSchema.parse(req.body)

      if (requestBody.image) {
        const uploadResponse = await cloudinary.uploader.upload(requestBody.image, {
          overwrite: true,
          invalidate: true,
          public_id: userId + '_profile',
          folder: 'thullo',
          resource_type: 'image',
          eager: { width: 300, height: 300, quality: 70 },
        })

        requestBody.image = uploadResponse.secure_url
      }

      const updatedUser = await db.user.update({
        data: requestBody,
        where: { id: userId },
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

      return res.status(200).json(updatedUser)
    } catch (error) {
      return res.status(400).json({
        error: 'Unable to update profile. Please try again',
      })
    }
  })

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '4mb',
    },
  },
}

export default handler
