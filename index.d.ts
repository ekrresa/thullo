declare namespace NodeJS {
  export interface ProcessEnv {
    NEXTAUTH_SECRET: string;
    GITHUB_ID: string;
    GITHUB_SECRET: string;
    EMAIL_SERVER: string;
    EMAIL_FROM: string;
  }
}
