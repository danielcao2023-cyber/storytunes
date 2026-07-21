import { getIronSession, SessionOptions } from 'iron-session';
import { cookies } from 'next/headers';
import { UserSession } from '@/types';

const SESSION_PASSWORD = process.env.SESSION_SECRET || 'dev-mode-fallback-password-32chars';

export const sessionOptions: SessionOptions = {
  password: SESSION_PASSWORD,
  cookieName: 'storytunes-session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 30,
  },
};

export async function getSession() {
  const cookieStore = await cookies();
  return getIronSession<UserSession>(cookieStore, sessionOptions);
}

export async function login(password: string): Promise<boolean> {
  const familyPassword = process.env.FAMILY_PASSWORD;
  if (!familyPassword) return true; // No password set = anyone can log in
  if (password !== familyPassword) return false;
  const session = await getSession();
  session.isLoggedIn = true;
  await session.save();
  return true;
}

export async function logout() {
  const session = await getSession();
  session.destroy();
}
