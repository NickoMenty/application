'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';

import { itemRepo } from '@/app/repositories';
import { getPayload } from '@/lib/session';
import { LOGIN, PROFILE_ITEMS } from '@/constants/navigation';
import DeleteItem from '@/usecases/DeleteItem';

// eslint-disable-next-line import/prefer-default-export
export async function deleteItem(id: ItemId) {
  try {
    const user = await getPayload();

    if (!user) {
      return redirect(LOGIN);
    }

    return await new Promise<void>((resolve, reject) => {
      const presenter: DeleteItemOutPort = {
        present(): Promise<void> | void {
          resolve(redirect(PROFILE_ITEMS));
        },
      };

      new DeleteItem(presenter, itemRepo).execute({
        id,
        userId: user.id,
      }).catch(reject);
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.flatten().fieldErrors;
    }
    throw error;
  }
}
