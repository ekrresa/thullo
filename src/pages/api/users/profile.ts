import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';

import { db } from '@lib/prisma';
import { withAuthentication } from '@lib/middleware/with-authentication';
import { UserProfileInputSchema } from '@models/user';

const handler = nextConnect();

handler
  .use(withAuthentication)
  .post(async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const userId = req.session.user.id;
      const requestBody = UserProfileInputSchema.parse(req.body);

      await db.user.update({ data: requestBody, where: { id: userId } });

      return res.status(200).json({ data: 'Profile updated successfully' });
    } catch (error) {
      return res.status(400).json({
        error: 'Unable to update profile. Please try again',
      });
    }
  });

export default handler;
