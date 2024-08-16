'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';

import { itemRepo, fileRepo } from '@/app/repositories';
import { getPayload } from '@/lib/session';
import { LOGIN } from '@/constants/navigation';
import UpdateItem from '@/usecases/UpdateItem';

// eslint-disable-next-line import/prefer-default-export
export async function updateItem(_currentState: unknown, formData: FormData) {
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
      return { errors: validatedFields.error.flatten().fieldErrors };
    }

    const user = await getPayload();

    if (!user || user.id.toString() !== formData.get('userId')) {
      return redirect(LOGIN);
    }

    return await new Promise((resolve, reject) => {
      const presenter: UpdateItemOutPort = {
        present(): Promise<void> | void {
          resolve({
            message: 'Updated',
          });
        },
      };

      new UpdateItem(presenter, itemRepo, fileRepo).execute({
        id: Number(formData.get('id') || ''),
        title: formData.get('title') as string || '',
        price: Number(formData.get('price') || ''),
        description: formData.get('description') as string || '',
        userId: user.id,
        files: formData.getAll('files') as File[],
      }).catch(reject);
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.flatten().fieldErrors;
    }
    throw error;
  }
}
