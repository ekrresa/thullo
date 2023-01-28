import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';

import { db } from '@lib/prisma';
import { withAuthentication } from '@lib/middleware/with-authentication';
import { UserProfileInputSchema } from '@models/user';

const handler = nextConnect();

handler.use(withAuthentication).get(async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const userId = req.session.user.id;

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
    });

    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({
      error: 'Error fetching user profile',
    });
  }
});

handler
  .use(withAuthentication)
  .post(async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const userId = req.session.user.id;
      const requestBody = UserProfileInputSchema.parse(req.body);

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
      });

      return res.status(200).json(updatedUser);
    } catch (error) {
      return res.status(400).json({
        error: 'Unable to update profile. Please try again',
      });
    }
  });

export default handler;
