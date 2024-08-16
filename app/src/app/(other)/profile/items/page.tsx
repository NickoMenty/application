import React from 'react';
import Link from 'next/link';
import GetItems from '@/usecases/GetItems';
import { itemRepo, fileRepo } from '@/app/repositories';
import { PROFILE_ITEMS_CREATE, PROFILE_ITEMS_SHOW } from '@/constants/navigation';
import { getPayload } from '@/lib/session';
import { Button } from '@nextui-org/button';
import DeleteButton from '@/app/(other)/profile/items/DeleteButton';

async function getData(): Promise<Item[]> {
  const user = await getPayload() as User;
  return new Promise<Item[]>((resolve, reject) => {
    const presenter: GetItemsOutPort = {
      present: (out: GetItemsOut) => resolve(out.items),
    };

    new GetItems(presenter, itemRepo, fileRepo)
      .execute({ userId: user.id, customerId: null })
      .catch(reject);
  });
}

export default async function Catalog() {
  const items = await getData();
  return (
    <div className="flex flex-col gap-4">
      <div>
        <Button as={Link} href={PROFILE_ITEMS_CREATE} color="primary">Create new item</Button>
      </div>
      <div className="flex items-center justify-center">
        <div className="my-auto grid max-w-7xl grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {items.map((item) => (
            <div key={item.id} className="relative">
              <Link
                href={PROFILE_ITEMS_SHOW.replace(':id', String(item.id))}
                className="group relative flex w-full flex-none flex-col gap-3"
                aria-label={item.title}
              >
                <div className="relative rounded-large shadow-none shadow-black/5">
                  <div className="relative overflow-hidden rounded-large">
                    <img
                      src={item.files[0]?.path || 'https://nextuipro.nyc3.cdn.digitaloceanspaces.com/components-images/places/2.jpeg'}
                      className="relative z-10 aspect-square w-full rounded-large object-cover shadow-none shadow-black/5 duration-300 group-hover:scale-110 motion-reduce:transition-none"
                      alt={item.title}
                      width={300}
                      height={300}
                    />
                  </div>
                  <img
                    src={item.files[0]?.path || 'https://nextuipro.nyc3.cdn.digitaloceanspaces.com/components-images/places/2.jpeg'}
                    className="absolute inset-0 z-0 size-full translate-y-1 scale-105 rounded-large object-cover opacity-30 blur-lg saturate-150"
                    alt={item.title}
                    aria-hidden="true"
                    width={300}
                    height={300}
                  />
                </div>
                <div className="mt-1 flex flex-col gap-2 px-1">
                  <div className="flex items-start justify-between gap-1">
                    <h3 className="text-small font-medium text-default-700">{item.title}</h3>
                  </div>
                  <p className="line-clamp-3 text-small text-default-500">{item.description}</p>
                  <p className="text-small font-medium text-default-500">
                    ETH
                    {' '}
                    {item.price}
                  </p>
                </div>
              </Link>
              <div className="absolute right-1 top-1 z-10">
                <DeleteButton id={item.id} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
