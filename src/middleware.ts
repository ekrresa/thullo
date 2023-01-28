import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(function middleware(req) {
  const token = req.nextauth.token;
  const isAuth = Boolean(token);
  const isAuthPage = req.nextUrl.pathname.startsWith('/auth');

  if (isAuthPage && isAuth) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  if (!isAuth) {
    let callbackUrl = req.nextUrl.pathname;
    if (req.nextUrl.search) {
      callbackUrl += req.nextUrl.search;
    }

    return NextResponse.redirect(
      new URL(`/auth?callbackUrl=${encodeURIComponent(callbackUrl)}`, req.url)
    );
  }
});

export const config = { matcher: ['/profile', '/auth'] };
