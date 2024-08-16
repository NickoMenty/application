import React from 'react';
import Sidebar from '@/app/(other)/profile/Sidebar';

export default function ProfileLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex grow">
      <Sidebar />
      <div className="p-6">
        {children}
      </div>
    </div>
  );
}
