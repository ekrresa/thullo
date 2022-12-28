export const ROUTES = {
  home: '/',
  auth: '/auth',
  profile: '/profile',
  board: (boardId: number) => `/board/${boardId}`,
};

export const EMAIL_SERVER = process.env.EMAIL_SERVER;
export const EMAIL_FROM = process.env.EMAIL_FROM;

export const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
export const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
