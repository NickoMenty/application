import React from 'react';
import { itemRepo, fileRepo } from '@/app/repositories';
import GetItem from '@/usecases/GetItem';
import { redirect } from 'next/navigation';
import { CATALOG } from '@/constants/navigation';
import BuyItem from '@/app/(other)/catalog/[item]/BuyItem';
import Gallery from '@/app/(other)/catalog/[item]/Gallery';
import { getPayload } from '@/lib/session';

type PageProps = {
  params: {
    item: string;
  }
};

function getData({ id }: { id: string }): Promise<Item | null> {
  return new Promise<Item | null>((resolve, reject) => {
    const presenter: GetItemOutPort = {
      present: (out: GetItemOut) => resolve(out.item),
    };

    new GetItem(presenter, itemRepo, fileRepo).execute({ id: Number(id) }).catch(reject);
  });
}

export default async function Item({ params: { item } }: PageProps) {
  const data = await getData({ id: item });

  if (!data) return redirect(CATALOG);

  const user = await getPayload();

  return (
    <div className="relative flex min-h-dvh flex-col bg-background pt-16" id="app-container">
      <div className="flex items-center justify-center p-4">
        <div className="size-full max-w-7xl px-2 lg:px-24">
          <div className="relative flex flex-col gap-4 lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
            <Gallery images={data.files.map(({ path }) => path)} />
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold tracking-tight">{data.title}</h1>
              <h2 className="sr-only">Product information</h2>
              <p className="text-xl font-medium tracking-tight">
                ETH
                {' '}
                {data.price}
              </p>
              <div className="mt-4">
                <p className="sr-only">Product description</p>
                <p className="line-clamp-3 text-medium text-default-500">{data.description}</p>
              </div>
              <div className="mt-2 flex gap-2">
                <BuyItem
                  item={{
                    id: data.id,
                    title: data.title,
                    price: data.price,
                    description: data.description,
                    userId: data.userId,
                    createdAt: data.createdAt,
                    updatedAt: data.updatedAt,
                    deletedAt: data.deletedAt,
                  }}
                  scanUrl={process.env.SCAN_URL || 'https://etherscan.io'}
                  user={user}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
