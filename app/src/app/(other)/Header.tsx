import React from 'react';
import Link from 'next/link';
import { getPayload } from '@/lib/session';
import {
  Navbar, NavbarBrand, NavbarContent, NavbarItem,
} from '@nextui-org/navbar';
import { Button } from '@nextui-org/button';
import UserNav from '@/app/(other)/UserNav';
import { LOGIN, REGISTER } from '@/constants/navigation';

export default async function Header() {
  const user = await getPayload();
  return (
    <Navbar isBordered>
      <NavbarBrand>
        <Link href="/" className="flex text-black">
          <span>Logo</span>
          <p className="font-bold text-inherit">Name</p>
        </Link>
      </NavbarBrand>

      {user ? (
        <UserNav user={user} />
      ) : (
        <NavbarContent justify="end">
          <NavbarItem className="hidden lg:flex">
            <Link href={LOGIN}>Login</Link>
          </NavbarItem>
          <NavbarItem>
            <Button as={Link} href={REGISTER} color="primary" variant="flat">
              Sign Up
            </Button>
          </NavbarItem>
        </NavbarContent>
      )}
    </Navbar>
  );
}
