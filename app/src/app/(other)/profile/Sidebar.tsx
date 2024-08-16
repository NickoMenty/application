'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IdentificationIcon, HomeIcon } from '@heroicons/react/24/outline';
import { LinkProps } from 'next/dist/client/link';
import navigation from '@/constants/navigation';
import cn from '@/utils/cn';

type SidebarLinkProps = {
  title: string;
  icon: React.ElementType;
  isActive?: boolean;
} & LinkProps;

function SidebarLink({
  title, icon: Icon, isActive = false, ...r
}: SidebarLinkProps) {
  return (
    <Link
      {...r}
      title={title}
      className={cn('flex w-full items-center justify-between gap-2 text-default-500 rounded-large px-3 py-2.5 outline-none hover:bg-default/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus', {
        'bg-default-100 text-foreground': isActive,
      })}
    >
      <Icon className="size-6" />
      <span className="flex-1 truncate text-small font-medium">{title}</span>
    </Link>
  );
}

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex items-center justify-start">
      <div className="relative flex h-full w-72 flex-col border-r border-divider p-6">
        <div className="h-full overflow-y-auto">
          <div data-slot="base" className="relative flex w-full list-none flex-col gap-1 p-1">
            <nav data-slot="list" className="flex w-full flex-col items-center gap-0.5 outline-none" tabIndex={-1}>
              <SidebarLink href={navigation.PROFILE_ITEMS} title="Items" icon={HomeIcon} isActive={pathname === navigation.PROFILE_ITEMS} />
              <SidebarLink href={navigation.PROFILE_NFTS} title="NFTS" icon={IdentificationIcon} isActive={pathname === navigation.PROFILE_NFTS} />
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}
