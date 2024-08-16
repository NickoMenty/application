'use server';

import { cookies } from 'next/headers';

export type SessionPayload = {
  id: UserId;
  email: Email;
  firstName: string;
  lastName: string;
  address: string;
  createdAt: CreatedAt;
  updatedAt: UpdatedAt;
};

async function setSession(session: string): Promise<void> {
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
  cookies().set('session', session, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  });
}

export async function getSession(): Promise<string | undefined> {
  return cookies().get('session')?.value;
}

export async function getPayload(): Promise<SessionPayload | null> {
  const session = await getSession();

  if (!session) {
    return null;
  }

  return JSON.parse(Buffer.from(session, 'base64').toString('utf8'));
}

export async function createSession(user: User): Promise<void> {
  try {
    const payload: SessionPayload = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      address: user.address,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    const session = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64');

    await setSession(session);
  } catch (e: any) {
    console.log(e.message);
    console.log(user);
    throw e;
  }
}

export async function updateSession(): Promise<void> {
  const session = await getSession();

  if (!session) {
    return;
  }

  await setSession(session);
}

export async function deleteSession(): Promise<void> {
  cookies().delete('session');
}
