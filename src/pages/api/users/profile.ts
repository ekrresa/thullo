import { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth/next';

import { db } from '@lib/prisma';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      message: 'Method Not Allowed',
    });
  }

  try {
    const session = await unstable_getServerSession(req, res, authOptions);
    await db.user.update({ data: req.body, where: { id: session?.user.id } });

    return res.status(200).json({ data: 'Profile updated successfully' });
  } catch (error) {
    return res.status(500).json({
      message: 'Unable to update profile.Please try again',
    });
  }
}
