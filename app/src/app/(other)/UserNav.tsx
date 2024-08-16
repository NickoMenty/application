'use client';

import React, { useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Dropdown, DropdownItem, DropdownMenu, DropdownTrigger,
} from '@nextui-org/dropdown';
import { Avatar } from '@nextui-org/avatar';
import { NavbarContent } from '@nextui-org/navbar';
import { logout } from '@/app/(other)/actions';
import { PROFILE_ITEMS, PROFILE_NFTS } from '@/constants/navigation';

type UserNavProps = {
  user: User
};

export default function UserNav({ user }: UserNavProps) {
  const logoutRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  return (
    <NavbarContent as="div" justify="end">
      <Dropdown placement="bottom-end">
        <DropdownTrigger>
          <Avatar
            isBordered
            as="button"
            className="transition-transform"
            color="primary"
            name={`${user.firstName[0]}${user.lastName[0]}`}
            size="sm"
          />
        </DropdownTrigger>
        <DropdownMenu
          aria-label="Profile Actions"
          variant="flat"
          onAction={(k) => {
            if (k === 'logout') {
              logoutRef.current?.requestSubmit();
              return;
            }
            router.push(String(k));
          }}
        >
          <DropdownItem key="profile" className="h-14 gap-2">
            <p className="font-semibold">Signed in as</p>
            <p className="font-semibold">{user.email}</p>
          </DropdownItem>
          <DropdownItem key={PROFILE_ITEMS}>My Items</DropdownItem>
          <DropdownItem key={PROFILE_NFTS}>My Nfts</DropdownItem>
          <DropdownItem key="logout" textValue="logout" color="danger">
            <form action={logout} ref={logoutRef} />
            Log Out
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </NavbarContent>
  );
}
