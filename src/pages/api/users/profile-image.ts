import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import { v2 as cloudinary } from 'cloudinary';

import { db } from '@lib/prisma';
import { withAuthentication } from '@lib/middleware/with-authentication';
import { ProfileImageUpdateSchema } from '@models/user';

const handler = nextConnect<NextApiRequest, NextApiResponse>();

handler.use(withAuthentication).post(async (req, res) => {
  try {
    const userId = req.session.user.id;
    const body = ProfileImageUpdateSchema.parse(req.body);

    const uploadResponse = await cloudinary.uploader.upload(body.image, {
      overwrite: true,
      invalidate: true,
      public_id: userId + '_profile',
      folder: 'thullo',
      resource_type: 'image',
      eager: { width: 300, height: 300, quality: 70 },
    });

    await db.user.update({
      data: { image: uploadResponse.secure_url },
      where: { id: userId },
    });

    return res.status(200).json({ data: uploadResponse.secure_url });
  } catch (error) {
    res.status(400).json({ error: 'An error occurred while uploading file' });
  }
});

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '4mb',
    },
  },
};

export default handler;
