import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const privateRoutes = ['/profile', '/notes'];
const publicRoutes = ['/sign-in', '/sign-up'];

export default async function proxy(request: NextRequest) {
  const { nextUrl, cookies } = request;
  const { pathname } = nextUrl;

  if (
    pathname.includes('.') || 
    pathname.startsWith('/_next') || 
    pathname.startsWith('/api')
  ) {
    return NextResponse.next();
  }

  const hasToken = cookies.getAll().length > 0;

  const isPrivateRoute = privateRoutes.some((route) => pathname.startsWith(route));
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));

  if (isPrivateRoute && !hasToken) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  if (isPublicRoute && hasToken) {
    return NextResponse.redirect(new URL('/profile', request.url));
  }

  return NextResponse.next();
}

export const config = {

  matcher: ['/((?!.*\\.).*)'],
};