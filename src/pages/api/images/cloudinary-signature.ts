import cloudinary from 'cloudinary';
import { NextApiRequest, NextApiResponse } from 'next';

const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET as string;
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY as string;

export default function cloudinarySignatureHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const signature = cloudinary.v2.utils.api_sign_request(
      { ...req.body, timestamp },
      CLOUDINARY_API_SECRET
    );

    res.status(200).send({ api_key: CLOUDINARY_API_KEY, signature, timestamp });
  } catch (error) {
    res.status(400).send({ message: 'An error occurred.' });
  }
}
