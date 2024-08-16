'use client';

import React, { useEffect, useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { Button } from '@nextui-org/button';
import { Input } from '@nextui-org/input';
import EmailInput from '@/components/EmailInput';
import PasswordInput from '@/components/PasswordInput';
import { register } from '@/app/auth/register/actions';

function SubmitButton() {
  const { pending } = useFormStatus();

  return <Button isLoading={pending} type="submit" color="primary" fullWidth>Sign Up</Button>;
}

export default function RegisterForm() {
  const [formErrors, dispatch] = useFormState(register, {});
  const [errors, setErrors] = useState(formErrors || {});

  useEffect(() => {
    setErrors(formErrors || {});
  }, [formErrors]);

  const removeError = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.name as 'firstName' | 'lastName' | 'email' | 'password' | 'confirmPassword';
    setErrors(({ [input]: _, ...r }) => r);
  };

  return (
    <form className="flex flex-col gap-3" action={dispatch}>
      <Input
        isInvalid={Boolean(errors.firstName)}
        errorMessage={errors.firstName?.[0]}
        name="firstName"
        variant="bordered"
        label="First name"
        placeholder="Enter first name"
        onChange={removeError}
      />
      <Input
        isInvalid={Boolean(errors.lastName)}
        errorMessage={errors.lastName?.[0]}
        name="lastName"
        variant="bordered"
        label="Last name"
        placeholder="Enter last name"
        onChange={removeError}
      />
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
      <PasswordInput
        isInvalid={Boolean(errors.confirmPassword)}
        errorMessage={errors.confirmPassword?.[0]}
        name="confirmPassword"
        label="Confirm password"
        placeholder="Confirm password"
        onChange={removeError}
      />
      <SubmitButton />
    </form>
  );
}
