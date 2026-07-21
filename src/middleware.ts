import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { sessionOptions } from '@/lib/session';
import { UserSession } from '@/types';

export async function middleware(request: NextRequest) {
  // Dev mode: no password configured → skip auth entirely
  if (!process.env.SESSION_SECRET || !process.env.FAMILY_PASSWORD) {
    return NextResponse.next();
  }

  const response = NextResponse.next();
  const session = await getIronSession<UserSession>(request, response, sessionOptions);

  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/login') || pathname.startsWith('/api/auth')) {
    return response;
  }

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.includes('.')
  ) {
    return response;
  }

  if (!session.isLoggedIn) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
