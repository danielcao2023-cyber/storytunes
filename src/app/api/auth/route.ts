import { NextRequest, NextResponse } from 'next/server';
import { login, logout, getSession } from '@/lib/session';

export async function POST(request: NextRequest) {
  const { password, action } = await request.json();

  if (action === 'login') {
    const success = await login(password);
    if (!success) {
      return NextResponse.json({ error: 'Wrong password' }, { status: 401 });
    }
    return NextResponse.json({ ok: true });
  }

  if (action === 'logout') {
    await logout();
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}

export async function GET() {
  const session = await getSession();
  return NextResponse.json({ isLoggedIn: session.isLoggedIn ?? false });
}
