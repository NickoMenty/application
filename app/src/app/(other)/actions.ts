'use server';

import { redirect } from 'next/navigation';

import { deleteSession } from '@/lib/session';
import { LOGIN } from '@/constants/navigation';

// eslint-disable-next-line import/prefer-default-export
export async function logout() {
  await deleteSession();
  redirect(LOGIN);
}
