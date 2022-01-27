import { NextApiRequest, NextApiResponse } from 'next';
import cloudinary from 'cloudinary';

export default async function UploadUrlHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const result = await cloudinary.v2.uploader.upload(req.body.url, {
      public_id: req.body.public_id,
      folder: 'thullo/boards',
      overwrite: true,
    });

    res.status(200).send(result);
  } catch (error) {
    res.status(400).send({ message: 'An error occurred.' });
  }
}
