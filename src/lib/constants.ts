export const ROUTES = {
  home: '/',
  auth: '/auth',
  profile: '/profile',
  board: (boardId: number) => `/board/${boardId}`,
};
