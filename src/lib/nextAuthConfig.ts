import { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import EmailProvider from 'next-auth/providers/email';
import GitHubProvider from 'next-auth/providers/github';
import { PrismaAdapter } from '@next-auth/prisma-adapter';

import { db } from './prisma';
import {
  EMAIL_FROM,
  EMAIL_SERVER,
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
} from './constants';
import { parseError } from './utils';

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(db),
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/auth',
  },
  providers: [
    EmailProvider({
      from: EMAIL_FROM,
      server: EMAIL_SERVER,
    }),
    GitHubProvider({
      clientId: GITHUB_CLIENT_ID!,
      clientSecret: GITHUB_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'guest_signup',
      type: 'credentials',
      credentials: {
        email: {},
      },
      async authorize(credentials, req) {
        if (!credentials?.email) {
          return null;
        }

        try {
          return await db.user.create({
            data: {
              email: credentials.email,
              isGuest: true,
              emailVerified: new Date(),
            },
          });
        } catch (error) {
          // TODO: log error
          const errorMessage = parseError(error);
          throw new Error(errorMessage);
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (user) return true;

      return false;
    },
    async session({ session, token }) {
      if (token.sub) {
        session.user.id = token.sub;
      }

      return session;
    },
    async jwt({ token }) {
      return token;
    },
  },
};
