'use server';

import { redirect } from 'next/navigation';
import {
  itemRepo, storageRepo, userRepo, itemContractRepo,
} from '@/app/repositories';
import { getPayload } from '@/lib/session';
import { LOGIN } from '@/constants/navigation';
import BuyItem from '@/usecases/BuyItem';
import GetTokenUri from '@/usecases/GetTokenUri';
import GetUser from '@/usecases/GetUser';

export async function buy(id: ItemId): Promise<string> {
  try {
    const user = await getPayload();

    if (!user) {
      return redirect(LOGIN);
    }

    return await new Promise((resolve, reject) => {
      const presenter: BuyItemOutPort = {
        present({ tx }: BuyItemOut): Promise<void> | void {
          resolve(tx);
        },
      };

      new BuyItem(presenter, itemRepo, userRepo, storageRepo).execute({
        itemId: id,
        userId: user.id,
      }).catch(reject);
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getTokenUri(id: ItemId, password: string): Promise<string> {
  try {
    const user = await getPayload();

    if (!user) {
      return redirect(LOGIN);
    }

    return await new Promise((resolve, reject) => {
      const presenter: GetTokenUriOutPort = {
        present({ uri }: GetTokenUriOut): Promise<void> | void {
          resolve(uri);
        },
      };

      new GetTokenUri(presenter, itemRepo, userRepo, storageRepo, itemContractRepo).execute({
        itemId: id,
        userId: user.id,
        password,
      }).catch(reject);
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getOwner(id: UserId): Promise<string> {
  try {
    const user = await getPayload();

    if (!user) {
      return redirect(LOGIN);
    }

    return await new Promise((resolve, reject) => {
      const presenter: GetUserOutPort = {
        present(out: GetUserOut): Promise<void> | void {
          resolve(out.user?.address || '');
        },
      };

      new GetUser(presenter, userRepo).execute({ id }).catch(reject);
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
}
