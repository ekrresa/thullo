export const ROUTES = {
  home: '/',
  login: '/auth/login',
  signup: '/auth/signup',
  profile: '/profile',
  board: (boardId: number) => `/board/${boardId}`,
};
