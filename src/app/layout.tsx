import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { Analytics } from '@vercel/analytics/react';

import '@/style/globals.css';

const NostrContext = dynamic(() => import('@/context/Nostr').then((mod) => mod.NostrContext), {
  loading: () => (
    <div className='flex justify-center items-center w-full h-full'>
      <p className='font-bold'>Loading...</p>
    </div>
  ),
  ssr: false,
});

export const metadata: Metadata = {
  title: 'Eventro',
  description:
    'Discover and organize decentralized events powered by Nostr. Your gateway to a world of exciting meetups, workshops, and gatherings.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={`antialiased`}>
        <NostrContext>{children}</NostrContext>
        <Analytics />;
      </body>
    </html>
  );
}
