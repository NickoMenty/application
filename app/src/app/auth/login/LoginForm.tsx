'use client';

import React, { useEffect, useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { Button } from '@nextui-org/button';
import EmailInput from '@/components/EmailInput';
import PasswordInput from '@/components/PasswordInput';
import { login } from '@/app/auth/login/actions';

function SubmitButton() {
  const { pending } = useFormStatus();

  return <Button isLoading={pending} type="submit" color="warning" fullWidth>Sign In</Button>;
}

export default function LoginForm() {
  const [formErrors, dispatch] = useFormState(login, {});
  const [errors, setErrors] = useState(formErrors || {});

  useEffect(() => {
    setErrors(formErrors || {});
  }, [formErrors]);

  const removeError = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.name as 'email' | 'password';
    setErrors(({ [input]: _, ...r }) => r);
  };

  return (
    <form className="flex flex-col gap-3" action={dispatch}>
      <EmailInput
        isInvalid={Boolean(errors.email)}
        errorMessage={errors.email?.[0]}
        onChange={removeError}
      />
      <PasswordInput
        isInvalid={Boolean(errors.password)}
        errorMessage={errors.password?.[0]}
        onChange={removeError}
      />
      <SubmitButton />
    </form>
  );
}
