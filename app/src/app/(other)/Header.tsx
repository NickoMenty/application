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
    // MY STYLING - FELL FREE TO DELETE
    <Navbar isBordered style={{ backgroundColor: '#fc7703' }}> 
      <NavbarBrand>
        <Link href="/" className="flex text-black">
          <span className="text-white">Rent</span>
          <p className="font-bold text-inherit">Dar</p>
        </Link>
      </NavbarBrand>

      {user ? (
        <UserNav user={user} />
      ) : (
        <NavbarContent justify="end">
          <NavbarItem className="hidden lg:flex">
            <Link href={LOGIN} className="text-white">Login</Link>
          </NavbarItem>
          <NavbarItem>
            <Button as={Link} href={REGISTER} color="default" variant="flat">
              Sign Up
            </Button>
          </NavbarItem>
        </NavbarContent>
      )}
    </Navbar>
  );
}
