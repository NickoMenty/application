import React from 'react';
import Link from 'next/link';
import { Navbar, NavbarBrand } from '@nextui-org/navbar';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default async function Header() {
  return (
    <Navbar>
      <NavbarBrand className="gap-1" as={Link} href="/">
        <ArrowLeftIcon className="size-5" />
        <span className="font-bold text-inherit">Back</span>
      </NavbarBrand>
    </Navbar>
  );
}
