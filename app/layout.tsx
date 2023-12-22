import './globals.css';
import '@radix-ui/themes/styles.css';

import { Theme } from '@radix-ui/themes';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Interactive Quiz Maker',
  description:
    'Upload a JSON file to create your own interactive quiz. Easy, quick and fun',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <Theme appearance='light'> {children} </Theme>
      </body>
    </html>
  );
}
