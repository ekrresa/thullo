import formidable from 'formidable';
import type { NextApiRequest } from 'next';

export const FormidableError = formidable.errors.FormidableError;

export async function parseForm(
  req: NextApiRequest
): Promise<{ fields: formidable.Fields; files: formidable.Files }> {
  return new Promise(async (resolve, reject) => {
    const form = formidable({
      allowEmptyFiles: false,
      maxFiles: 1,
      maxFileSize: 10 * 1024 * 1024,
    });

    form.parse(req, (err, fields, files) => {
      if (err) {
        reject(err);
      } else {
        resolve({ fields, files });
      }
    });
  });
}
