import './globals.css';
import '@radix-ui/themes/styles.css';

import { Theme } from '@radix-ui/themes';
import { Button, Flex, Text } from '@radix-ui/themes';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AWS Quiz',
  description: 'Client for AWS Q&A',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        {/* <Theme> */}
        {children}
        {/* </Theme> */}
      </body>
    </html>
  );
}
