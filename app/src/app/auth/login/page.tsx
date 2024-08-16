import React from 'react';
import { Link } from '@nextui-org/link';
import { REGISTER } from '@/constants/navigation';
import LoginForm from '@/app/auth/login/LoginForm';

export default function Register() {
  return (
    <div className="relative flex min-h-dvh flex-col bg-background pt-16">
      <div className="flex items-center justify-center p-4">
        <div className="flex size-full flex-col items-center justify-center">
          <div className="flex flex-col items-center pb-6">
            <p className="text-xl font-medium">Welcome Back</p>
            <p className="text-small text-default-500">Log in to your account to continue</p>
          </div>
          <div className="mt-2 flex w-full max-w-sm flex-col gap-4 rounded-large bg-content1 px-8 py-6 shadow-small">
            <LoginForm />
            <p className="text-center text-small">
              Already have an account?&nbsp;
              <Link
                className="relative inline-flex items-center text-small text-primary no-underline outline-none transition-opacity tap-highlight-transparent hover:opacity-80 active:opacity-disabled data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-offset-2 data-[focus-visible=true]:outline-focus"
                tabIndex={0}
                href={REGISTER}
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
