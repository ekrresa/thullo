import { unstable_getServerSession } from 'next-auth';
import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import { authOptions } from '@lib/nextAuthConfig';

const middleware = nextConnect<NextApiRequest, NextApiResponse>({ attachParams: true });

middleware.use(async (req, res, next) => {
  const session = await unstable_getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized action' });
  }

  req.session = session;

  next();
});

export const withAuthentication = middleware;
