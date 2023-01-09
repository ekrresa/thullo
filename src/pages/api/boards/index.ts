import { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth';
import nextConnect from 'next-connect';
import { v2 as cloudinary } from 'cloudinary';
import { BoardVisibility } from '@prisma/client';

import { db } from '@lib/prisma';
import { BoardCreateSchema } from '@models/index';
import { parseError } from '@lib/utils';
import { withAuthentication } from '@lib/middleware/with-authentication';
import { authOptions } from '@lib/nextAuthConfig';

const requestHandler = nextConnect<NextApiRequest, NextApiResponse>();

requestHandler.get(async (req, res) => {
  try {
    const session = await unstable_getServerSession(req, res, authOptions);

    const userId = session?.user.id;

    const whereQuery = userId
      ? {
          OR: [
            { userId: { equals: userId } },
            { visibility: 'PUBLIC' as BoardVisibility },
          ],
        }
      : { visibility: 'PUBLIC' as BoardVisibility };

    const boards = await db.board.findMany({
      where: whereQuery,
      orderBy: { updatedAt: 'desc' },
      include: { owner: true },
    });

    res.status(200).json({ data: boards });
  } catch (error) {
    const message = parseError(error);
    res.status(400).json({ error: message });
  }
});

requestHandler.use(withAuthentication).post(async (req, res) => {
  try {
    const requestBody = BoardCreateSchema.parse(req.body);

    const userId = req.session.user.id;

    const existingBoard = await db.board.findFirst({
      where: { userId, title: requestBody.title },
    });

    if (existingBoard) {
      throw new Error(`Board with ${requestBody.title} already exists`);
    }

    if (requestBody.image) {
      const uploadResponse = await cloudinary.uploader.upload(requestBody.image, {
        folder: 'thullo/boards',
        eager: { aspect_ratio: '16:9', quality: 80 },
      });

      requestBody.image = uploadResponse.secure_url;
    }

    const newBoard = await db.board.create({
      data: { ...requestBody, userId },
    });

    res.status(200).json({ data: newBoard });
  } catch (error) {
    const message = parseError(error);
    res.status(400).json({ error: message });
  }
});

export default requestHandler;

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '4mb',
    },
  },
};
