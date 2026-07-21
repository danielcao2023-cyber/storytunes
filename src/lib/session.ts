import { getIronSession, SessionOptions } from 'iron-session';
import { cookies } from 'next/headers';
import { UserSession } from '@/types';

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET!,
  cookieName: 'storytunes-session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 30, // 30 days
  },
};

export async function getSession() {
  const cookieStore = await cookies();
  return getIronSession<UserSession>(cookieStore, sessionOptions);
}

export async function login(password: string): Promise<boolean> {
  if (password !== process.env.FAMILY_PASSWORD) return false;
  const session = await getSession();
  session.isLoggedIn = true;
  await session.save();
  return true;
}

export async function logout() {
  const session = await getSession();
  session.destroy();
}
