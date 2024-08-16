import React from 'react';
import Header from '@/app/(other)/Header';

export default function OtherLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex h-screen flex-col">
      <Header />
      {children}
    </main>
  );
}
