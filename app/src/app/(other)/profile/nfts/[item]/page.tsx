import React from 'react';
import { redirect } from 'next/navigation';
import { itemRepo, fileRepo, itemContractRepo } from '@/app/repositories';
import GetItem from '@/usecases/GetItem';
import { PROFILE_NFTS } from '@/constants/navigation';
import Gallery from '@/app/(other)/catalog/[item]/Gallery';
import { getPayload } from '@/lib/session';
import GetItemContract from '@/usecases/GetItemContract';
import ContractButton from './ContractButton';

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

function getContract({ id }: { id: string }): Promise<ItemContract> {
  return new Promise<ItemContract>((resolve, reject) => {
    const presenter: GetItemContractOutPort = {
      present: (out: GetItemContractOut) => resolve(out.contract as ItemContract),
    };

    new GetItemContract(presenter, itemContractRepo).execute({ id }).catch(reject);
  });
}

export default async function Item({ params: { item } }: PageProps) {
  const data = await getData({ id: item });
  const user = await getPayload();

  if (!data || !user || user.id !== data.customerId || !data.contractId) {
    return redirect(PROFILE_NFTS);
  }

  const contract = await getContract({ id: data.contractId });

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
              <div className="mt-4 flex flex-col gap-2">
                <span>Contract:</span>
                <ContractButton contract={{
                  id: contract.id,
                  data: contract.data,
                  url: contract.url,
                }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
