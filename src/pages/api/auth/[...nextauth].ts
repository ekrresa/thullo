import NextAuth, { AuthOptions } from 'next-auth';
import EmailProvider from 'next-auth/providers/email';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '@lib/prisma';
import { EMAIL_FROM, EMAIL_SERVER } from '@lib/constants';

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
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
  ],
  callbacks: {
    async session({ session, token }) {
      session.user.isNew = Boolean(token.isNewUser);

      return session;
    },
    async jwt({ token, account, isNewUser }) {
      if (account) {
        token.isNewUser = isNewUser;
      }

      return token;
    },
  },
};

export default NextAuth(authOptions);
