'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@nextui-org/button';
import { Input, Textarea } from '@nextui-org/input';
import { useFormState, useFormStatus } from 'react-dom';
import FileUpload from '@/app/(other)/profile/items/FileUpload';
import { createItem } from '@/app/(other)/profile/items/create/actions';

function CreateButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      isLoading={pending}
      color="warning"
      type="submit"
    >
      Create
    </Button>
  );
}

export default function CreateItemForm() {
  const [formErrors, dispatch] = useFormState(createItem, {});
  const [errors, setErrors] = useState(formErrors || {});

  useEffect(() => {
    setErrors(formErrors || {});
  }, [formErrors]);

  const removeError = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.name as 'title' | 'price' | 'description';
    setErrors(({ [input]: _, ...r }) => r);
  };

  return (
    <form action={dispatch} className="relative flex flex-col gap-4 lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
      <div className="relative size-full flex-none">
        <FileUpload />
      </div>
      <div className="flex flex-col">
        <Input
          size="sm"
          placeholder="Enter item name"
          name="title"
          isInvalid={Boolean(errors.title)}
          errorMessage={errors.title?.[0]}
          onChange={removeError}
          classNames={{
            input: ['text-2xl font-bold'],
          }}
        />
        <h2 className="sr-only">Product information</h2>
        <div className="mt-1 text-xl font-medium tracking-tight">
          <Input
            size="sm"
            type="number"
            name="price"
            isInvalid={Boolean(errors.price)}
            errorMessage={errors.price?.[0]}
            onChange={removeError}
            placeholder="0.00"
            labelPlacement="outside"
            startContent={(
              <div className="pointer-events-none flex items-center">
                <span className="text-xl font-medium">ETH</span>
              </div>
            )}
            classNames={{
              input: ['text-xl font-medium'],
              inputWrapper: ['max-w-40'],
            }}
          />
        </div>
        <div className="mt-4">
          <p className="sr-only">Product description</p>
          <Textarea
            placeholder="Enter description"
            name="description"
            isInvalid={Boolean(errors.description)}
            errorMessage={errors.description?.[0]}
            onChange={removeError}
            size="sm"
            classNames={{
              input: ['text-medium text-default-500'],
            }}
          />
        </div>
        <div className="mt-2 flex gap-2">
          <CreateButton />
        </div>
      </div>
    </form>
  );
}
