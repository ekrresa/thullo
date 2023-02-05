import NextAuth from 'next-auth';
import { authOptions } from '@lib/nextAuthConfig';

export default NextAuth(authOptions);
