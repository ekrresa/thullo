import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import { v2 as cloudinary } from 'cloudinary';

import { db } from '@lib/prisma';
import { BoardCreateSchema } from '@models/board';
import { parseError } from '@lib/utils';
import { withAuthentication } from '@lib/middleware/with-authentication';

const requestHandler = nextConnect<NextApiRequest, NextApiResponse>();

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

requestHandler.get(async (req, res) => {
  try {
    const boards = await db.board.findMany();
    res.status(200).json({ data: boards });
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
