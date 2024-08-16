'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';

import { userRepo } from '@/app/repositories';
import { createSession } from '@/lib/session';
import { HOME } from '@/constants/navigation';
import SignIn from '@/usecases/SignIn';

// eslint-disable-next-line import/prefer-default-export
export async function login(_currentState: unknown, formData: FormData) {
  try {
    const validatedFields = z
      .object({
        email: z.string().trim().email(),
        password: z.string().trim().min(1),
      })
      .safeParse({
        email: formData.get('email'),
        password: formData.get('password'),
      });

    if (!validatedFields.success) {
      return validatedFields.error.flatten().fieldErrors;
    }

    const user = await new Promise<User>((resolve, reject) => {
      const presenter: SignInOutPort = {
        present(out: SignInOut): Promise<void> | void {
          resolve(out.user);
        },
      };

      new SignIn(presenter, userRepo).execute({
        email: formData.get('email') as Email || '',
        password: formData.get('password') as string || '',
      }).catch(reject);
    });

    await createSession(user);

    return redirect(HOME);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.flatten().fieldErrors;
    }
    throw error;
  }
}
