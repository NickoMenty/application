import React from 'react';
import { itemRepo, fileRepo } from '@/app/repositories';
import GetItem from '@/usecases/GetItem';
import { redirect } from 'next/navigation';
import { CATALOG } from '@/constants/navigation';
import UpdateItemForm from '@/app/(other)/profile/items/[item]/UpdateItemForm';
import { getPayload } from '@/lib/session';

type PageProps = {
  params: {
    item: string;
  }
};

async function getData({ id }: { id: string }): Promise<Item | null> {
  return new Promise<Item | null>((resolve, reject) => {
    const presenter: GetItemOutPort = {
      present: (out: GetItemOut) => resolve(out.item),
    };

    new GetItem(presenter, itemRepo, fileRepo).execute({ id: Number(id) }).catch(reject);
  });
}

export default async function Item({ params: { item } }: PageProps) {
  const data = await getData({ id: item });
  const user = await getPayload();

  if (!data || data.userId !== user?.id) return redirect(CATALOG);

  return (
    <div className="relative flex min-h-dvh flex-col bg-background pt-16" id="app-container">
      <div className="flex items-center justify-center p-4">
        <div className="size-full max-w-7xl px-2 lg:px-24">
          <UpdateItemForm item={{
            id: data.id,
            title: data.title,
            price: data.price,
            description: data.description,
            userId: data.userId,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
            deletedAt: data.deletedAt,
            files: data.files,
          }}
          />
        </div>
      </div>
    </div>
  );
}
