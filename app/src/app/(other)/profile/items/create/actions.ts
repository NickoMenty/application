'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';

import { fileRepo, itemRepo } from '@/app/repositories';
import { getPayload } from '@/lib/session';
import { LOGIN, PROFILE_ITEMS_SHOW } from '@/constants/navigation';
import CreateItem from '@/usecases/CreateItem';

// eslint-disable-next-line import/prefer-default-export
export async function createItem(_currentState: unknown, formData: FormData) {
  try {
    const validatedFields = z
      .object({
        title: z.string().trim().min(1),
        price: z.number().min(0.000000000001),
        description: z.string().trim().min(1),
      })
      .safeParse({
        title: formData.get('title'),
        price: Number(formData.get('price')),
        description: formData.get('description'),
      });

    if (!validatedFields.success) {
      return validatedFields.error.flatten().fieldErrors;
    }

    const user = await getPayload();

    if (!user) {
      return redirect(LOGIN);
    }

    return await new Promise<never>((resolve, reject) => {
      const presenter: CreateItemOutPort = {
        present(out: CreateItemOut): Promise<void> | void {
          resolve(redirect(PROFILE_ITEMS_SHOW.replace(':id', String(out.item.id))));
        },
      };

      new CreateItem(presenter, itemRepo, fileRepo).execute({
        title: formData.get('title') as string || '',
        price: Number(formData.get('price') || ''),
        description: formData.get('description') as string || '',
        userId: user.id,
        files: (formData.getAll('files') as File[]).filter(({ size }) => size > 0),
      }).catch(reject);
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.flatten().fieldErrors;
    }
    throw error;
  }
}
