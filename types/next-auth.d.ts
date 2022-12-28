import NextAuth, { DefaultSession } from 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      username: string | null;
      isGuest: boolean;
      isProfileSetup: boolean;
    } & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    isGuest: boolean;
    isProfileSetup: boolean;
    username: string | null;
  }
}
