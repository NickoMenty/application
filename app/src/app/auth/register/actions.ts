'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';

import { userRepo } from '@/app/repositories';
import CreateUser from '@/usecases/CreateUser';
import { createSession } from '@/lib/session';
import { HOME } from '@/constants/navigation';

// eslint-disable-next-line import/prefer-default-export
export async function register(_currentState: unknown, formData: FormData) {
  try {
    const validatedFields = z
      .object({
        firstName: z.string({ required_error: 'The first name is required' }).trim().min(1),
        lastName: z.string({ required_error: 'The last name is required' }).trim().min(1),
        email: z.string().trim().email(),
        password: z.string().trim().min(8),
        confirmPassword: z.string(),
      })
      .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ['confirmPassword'], // path of error
      }).safeParse({
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        password: formData.get('password'),
        confirmPassword: formData.get('confirmPassword'),
      });

    if (!validatedFields.success) {
      return validatedFields.error.flatten().fieldErrors;
    }

    const user = await new Promise<User>((resolve, reject) => {
      const presenter: CreateUserOutPort = {
        present(out: CreateUserOut): Promise<void> | void {
          resolve(out.user);
        },
      };

      new CreateUser(presenter, userRepo).execute({
        firstName: formData.get('firstName') as string || '',
        lastName: formData.get('lastName') as string || '',
        email: formData.get('email') as string || '',
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
