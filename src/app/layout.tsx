import type { Metadata } from 'next';

import '@/style/globals.css';
import { NostrContext } from '@/context/Nostr';

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
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
      </body>
    </html>
  );
}
