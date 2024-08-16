import React from 'react';
import { Input, InputProps } from '@nextui-org/input';

export default function EmailInput(props: InputProps) {
  return <Input type="email" name="email" variant="bordered" label="Email Address" placeholder="Enter your email" {...props} />;
}
