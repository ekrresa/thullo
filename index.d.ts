import { Session } from 'next-auth';

declare namespace NodeJS {
  export interface ProcessEnv {
    NEXTAUTH_SECRET: string;
    GITHUB_CLIENT_ID: string;
    GITHUB_CLIENT_SECRET: string;
    EMAIL_SERVER: string;
    EMAIL_FROM: string;
  }
}

declare module 'next' {
  export interface NextApiRequest {
    session: Session;
  }
}
