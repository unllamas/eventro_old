'use client';

import Link from 'next/link';
import { useNostrHooks, useAutoLogin, useActiveUser, useLogin } from 'nostr-hooks';

import { ndk } from '@/lib/nostr';
import { Footer } from '@/components/layout/footer';

export const NostrContext = ({ children }: any) => {
  useNostrHooks(ndk);
  useAutoLogin();

  const { loginWithExtension } = useLogin();
  const { activeUser } = useActiveUser();

  return (
    <div>
      <header className='border-b'>
        <div className='container mx-auto px-4 py-4 flex items-center justify-between'>
          <h1 className='text-2xl font-bold text-primary'>Eventro</h1>
          <nav className='hidden md:flex space-x-4'>
            <Link href='/' className='text-muted-foreground hover:text-primary'>
              Home
            </Link>
            <Link href='/home' className='text-muted-foreground hover:text-primary'>
              Events
            </Link>
            <Link href='/create' className='text-muted-foreground hover:text-primary'>
              Create
            </Link>

            {activeUser ? <p>Bienvenido</p> : <button onClick={() => loginWithExtension()}>Login</button>}
          </nav>
        </div>
      </header>
      {children}
      <Footer />
    </div>
  );
};
