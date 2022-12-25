import type { NextApiRequest, NextApiResponse } from 'next';
import Chance from 'chance';
import { supabase } from '@lib/supabaseServer';

const chance = new Chance();

export default async function AuthHandler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'POST':
      const email = chance.email({ domain: 'example.com' });
      const password = chance.word({ length: 8 });

      try {
        const result = await supabase.auth.api.createUser({
          email,
          password,
          user_metadata: { is_demo_user: true },
          email_confirm: true,
        });

        if (result.error) {
          res.status(result.error.status).json({ message: result.error.message });
          return;
        }

        res.status(200).send({ ...result.data, password });
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
