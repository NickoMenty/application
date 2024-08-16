import React from 'react';
import CreateItemForm from '@/app/(other)/profile/items/create/CreateItemForm';

export default function CreateItem() {
  return (
    <div className="relative flex min-h-dvh flex-col bg-background pt-16" id="app-container">
      <div className="flex items-center justify-center p-4">
        <div className="size-full max-w-7xl px-2 lg:px-24">
          <CreateItemForm />
        </div>
      </div>
    </div>
  );
}
