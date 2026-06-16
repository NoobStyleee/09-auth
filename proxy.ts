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

  let accessToken = cookies.get('accessToken')?.value;
  const refreshToken = cookies.get('refreshToken')?.value;

  const isPrivateRoute = privateRoutes.some((route) => pathname.startsWith(route));
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));

  let newCookiesString: string | null = null;

  if (!accessToken && refreshToken) {
    try {
      const apiUrl = new URL('/api/auth/session', request.url);
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          Cookie: request.headers.get('cookie') || '',
        },
      });

      if (response.ok) {
        const setCookieHeaders = response.headers.getSetCookie();
        
        if (setCookieHeaders.length > 0) {
          newCookiesString = setCookieHeaders.join(', ');
          
          accessToken = 'true'; 
        }
      }
    } catch (error) {
      console.error('Failed to silently refresh session in middleware:', error);
    }
  }

  const isAuth = !!accessToken;

  if (isPrivateRoute && !isAuth) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  if (isPublicRoute && isAuth) {
    const response = NextResponse.redirect(new URL('/', request.url));
    if (newCookiesString) {
      response.headers.set('Set-Cookie', newCookiesString);
    }
    return response;
  }

  const response = NextResponse.next();
  
  if (newCookiesString) {
    response.headers.set('Set-Cookie', newCookiesString);
  }

  return response;
}

export const config = {
  matcher: ['/((?!.*\\.).*)'],
};