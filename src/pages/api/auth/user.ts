import type { NextApiRequest, NextApiResponse } from 'next';
import faker from 'faker';
import { supabase } from '@lib/supabaseServer';

export default async function AuthHandler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'POST':
      const email = faker.internet.email();
      const password = faker.internet.password();

      try {
        const result = await supabase.auth.api.createUser({
          email,
          password,
          data: { is_demo_user: true },
        });

        if (result.error) {
          res.status(result.error.status).json({ message: result.error.message });
          return;
        }

        res.status(200).json({ data: { ...result.data, password } });
      } catch (error) {
        if (error instanceof Error) {
          res.status(400).json({ message: error.message });
        }
      }

      break;

    default:
      res.status(400).json({ message: 'Unsupported method' });
      break;
  }
}
