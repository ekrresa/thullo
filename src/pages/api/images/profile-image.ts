import { NextApiRequest, NextApiResponse } from 'next';
import { v2 as cloudinary } from 'cloudinary';
import { File } from 'formidable';
import { Buffer } from 'node:buffer';
import { Readable } from 'node:stream';
import sharp from 'sharp';

import { parseForm, FormidableError } from '@lib/file-upload-middleware';
import { db } from '@lib/prisma';

const bufferToStream = (buffer: Buffer) => {
  const readable = new Readable({
    read() {
      this.push(buffer);
      this.push(null);
    },
  });
  return readable;
};

export default async function FileHandler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      message: 'Method Not Allowed',
    });
  }

  try {
    const { fields, files } = await parseForm(req);
    const { userId, ...rest } = fields;

    const imageInput = (files.image as unknown as File).filepath;

    const imageBuffer = await sharp(imageInput)
      .webp({ quality: 90 })
      .resize(300, 300)
      .toBuffer();

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        overwrite: true,
        invalidate: true,
        resource_type: 'image',
        ...rest,
      },
      async (error, result) => {
        if (error) {
          return res.status(error.http_code || 400).json({ message: error.message });
        }

        await db.user.update({
          data: { image: result?.secure_url },
          where: { id: userId as string },
        });

        return res.status(200).json({ data: result?.secure_url });
      }
    );

    bufferToStream(imageBuffer).pipe(uploadStream);
  } catch (error) {
    if (error instanceof FormidableError) {
      return res.status(error.httpCode || 400).json({ message: error.message });
    }

    res.status(400).json({ message: 'An error occurred while uploading file' });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
