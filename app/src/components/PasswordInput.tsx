'use client';

import React from 'react';
import { Input, InputProps } from '@nextui-org/input';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

export default function PasswordInput(props: InputProps) {
  const [isVisible, setIsVisible] = React.useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <Input
      label="Password"
      name="password"
      variant="bordered"
      placeholder="Enter your password"
      endContent={(
        <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
          {isVisible ? (
            <EyeIcon className="size-5" />
          ) : (
            <EyeSlashIcon className="size-5" />
          )}
        </button>
      )}
      type={isVisible ? 'text' : 'password'}
      {...props}
    />
  );
}
