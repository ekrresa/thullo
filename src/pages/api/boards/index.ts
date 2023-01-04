import { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { v2 as cloudinary } from 'cloudinary';

import { db } from '@lib/prisma';
import { withMethods } from '@lib/middleware/with-methods';
import { BoardCreateSchema } from '@models/board';
import { parseError } from '@lib/utils';
import { authOptions } from '../auth/[...nextauth]';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // fetch all boards
  }

  if (req.method === 'POST') {
    try {
      const requestBody = BoardCreateSchema.parse(req.body);
      const session = await unstable_getServerSession(req, res, authOptions);
      const userId = session?.user.id;

      const existingBoard = await db.board.findFirst({
        where: { userId: session?.user.id, title: requestBody.title },
      });

      if (existingBoard) {
        throw new Error(`Board with ${requestBody.title} already exists`);
      }

      if (requestBody.image) {
        const uploadResponse = await cloudinary.uploader.upload(requestBody.image, {
          folder: 'thullo/boards',
        });

        requestBody.image = uploadResponse.secure_url;
      }

      console.log(requestBody);

      const newBoard = await db.board.create({
        data: { ...requestBody, userId: userId ?? '' },
      });

      res.status(200).json({ data: newBoard });
    } catch (error) {
      const message = parseError(error);
      res.status(400).json({ error: message });
    }
  }
}

export default withMethods(['GET', 'POST'], handler);
