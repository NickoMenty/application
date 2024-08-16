'use client';

import React, { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@nextui-org/button';
import {
  ethers, Eip1193Provider, Typed, ContractTransactionResponse,
} from 'ethers';
import { getOwner, getTokenUri } from '@/app/(other)/catalog/[item]/actions';
import { SessionPayload } from '@/lib/session';
import { LOGIN } from '@/constants/navigation';
import {
  Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure,
} from '@nextui-org/react';
import abi from './abi.json';

declare global {
  interface Window {
    ethereum: Eip1193Provider;
  }
}

type ItemDto = {
  id: ItemId;
  title: string;
  price: number;
  description: string;
  userId: UserId;
  createdAt: CreatedAt;
  updatedAt: UpdatedAt;
  deletedAt?: DeletedAt;
};

type BuyItemProps = {
  item: ItemDto;
  scanUrl: string;
  user: SessionPayload | null;
};

export default function BuyItem({ item, scanUrl, user }: BuyItemProps) {
  const router = useRouter();
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tx, setTx] = useState<string | null>(null);
  const {
    isOpen, onOpen, onOpenChange, onClose,
  } = useDisclosure();
  const passwordRef = useRef<HTMLInputElement>(null);

  // eslint-disable-next-line consistent-return
  const buy = async () => {
    setLoading(true);
    setError(null);
    setTx(null);
    try {
      if (!user) {
        return router.push(LOGIN);
      }
      let provider = new ethers.BrowserProvider(window.ethereum);
      const chainId = process.env.NEXT_PUBLIC_CHAIN_ID || '';
      if ((await provider.getNetwork()).chainId.toString() !== chainId) {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: ethers.toBeHex(chainId) }],
          });
        } catch (err: any) {
          // This error code indicates that the chain has not been added to MetaMask
          if (err.code === 4902) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainName: process.env.NEXT_PUBLIC_CHAIN_NAME,
                  chainId: ethers.toBeHex(chainId),
                  nativeCurrency: {
                    name: process.env.NEXT_PUBLIC_CHAIN_CURRENCY_NAME,
                    decimals: process.env.NEXT_PUBLIC_CHAIN_CURRENCY_DECIMAL,
                    symbol: process.env.NEXT_PUBLIC_CHAIN_CURRENCY_SYMBOL,
                  },
                  rpcUrls: [process.env.NEXT_PUBLIC_CHAIN_RPC],
                },
              ],
            });
          }
        }

        provider = new ethers.BrowserProvider(window.ethereum);
      }
      const nftContract = new ethers.Contract(
        process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '',
        abi,
        await provider.getSigner(),
      );
      const tokenUri = await getTokenUri(item.id, (passwordRef.current?.value as string) || '');
      const owner = await getOwner(item.userId);
      const { hash } : ContractTransactionResponse = await nftContract.mintNft(
        Typed.string(tokenUri),
        Typed.uint256(ethers.parseEther(item.price.toString())),
        Typed.address(owner),
        Typed.address(user.address),
        { value: ethers.parseEther(item.price.toString()) },
      );

      setTx(hash);
    } catch (e: any) {
      console.error(e);
      if (e.code !== 'ACTION_REJECTED') {
        setError(e.message);
      }
    }
    setLoading(false);
    onClose();
  };

  return (
    <div className="flex max-w-full flex-col">
      <div>
        <Button
          color="warning"
          onClick={onOpen}
          type="button"
        >
          <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" focusable="false" tabIndex={-1} width="24" height="24" viewBox="0 0 24 24">
            <path fill="currentColor" d="M2.237 2.288a.75.75 0 1 0-.474 1.423l.265.089c.676.225 1.124.376 1.453.529c.312.145.447.262.533.382c.087.12.155.284.194.626c.041.361.042.833.042 1.546v2.672c0 1.367 0 2.47.117 3.337c.12.9.38 1.658.982 2.26c.601.602 1.36.86 2.26.981c.866.117 1.969.117 3.336.117H18a.75.75 0 0 0 0-1.5h-7c-1.435 0-2.436-.002-3.192-.103c-.733-.099-1.122-.28-1.399-.556c-.235-.235-.4-.551-.506-1.091h10.12c.959 0 1.438 0 1.814-.248c.376-.248.565-.688.943-1.57l.428-1c.81-1.89 1.215-2.834.77-3.508C19.533 6 18.506 6 16.45 6H5.745a8.996 8.996 0 0 0-.047-.833c-.055-.485-.176-.93-.467-1.333c-.291-.404-.675-.66-1.117-.865c-.417-.194-.946-.37-1.572-.58zM7.5 18a1.5 1.5 0 1 1 0 3a1.5 1.5 0 0 1 0-3m9 0a1.5 1.5 0 1 1 0 3a1.5 1.5 0 0 1 0-3" />
          </svg>
          Buy
        </Button>
        <Modal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          placement="top-center"
        >
          <ModalContent>
            {(close) => (
              <>
                <ModalHeader className="flex flex-col gap-1">Set password</ModalHeader>
                <ModalBody>
                  <Input
                    ref={passwordRef}
                    autoFocus
                    label="Password"
                    placeholder="Enter password"
                    type="password"
                    size="sm"
                  />
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="flat" onPress={close}>
                    Cancel
                  </Button>
                  <Button isLoading={isLoading} color="warning" onPress={buy}>
                    Buy
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
      {error && <p className="pt-1 text-red-400">{error}</p>}
      {tx && <a href={`${scanUrl}/tx/${tx}`} className="pt-1 text-green-400" target="_blank" rel="noreferrer">Check transaction</a>}
    </div>
  );
}
