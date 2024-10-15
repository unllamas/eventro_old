'use client';

import { useNostrHooks, useAutoLogin } from 'nostr-hooks';

import { ndk } from '@/lib/nostr';
import { Footer } from '@/components/layout/footer';
import { Navbar } from '@/components/layout/navbar';

export const NostrContext = ({ children }: any) => {
  useNostrHooks(ndk);
  useAutoLogin();

  return (
    <div>
      <Navbar />
      {children}
      <Footer />
    </div>
  );
};
