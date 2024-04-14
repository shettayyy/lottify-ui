import './globals.css';

import type { Metadata } from 'next';
import { Inter, Quicksand } from 'next/font/google';

import { Search } from '@/components/core/search';
import { Header } from '@/components/layout/header';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});
const quicksand = Quicksand({
  subsets: ['latin'],
  variable: '--font-quicksand',
});

export const metadata: Metadata = {
  title: 'Lottify',
  description: 'Lightweight, scalable animations for your websites and apps',
  icons: [
    {
      href: 'favicon/favicon.ico',
      url: 'favicon/favicon.ico',
    },
    // apple touch icons
    {
      href: 'favicon/apple-touch-icon.png',
      url: 'favicon/apple-touch-icon.png',
    },
    // android chrome icons
    {
      href: 'favicon/android-chrome-192x192.png',
      url: 'favicon/android-chrome-192x192.png',
      sizes: '192x192',
    },
    {
      href: 'favicon/android-chrome-512x512.png',
      url: 'favicon/android-chrome-512x512.png',
      sizes: '512x512',
    },
    // 16x16 icon
    {
      href: 'favicon/favicon-16x16.png',
      url: 'favicon/favicon-16x16.png',
      sizes: '16x16',
    },
    // 32x32 icon
    {
      href: 'favicon/favicon-32x32.png',
      url: 'favicon/favicon-32x32.png',
      sizes: '32x32',
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${quicksand.variable}`}>
      <body className={'bg-neutral-900 font-inter text-slate-100'}>
        <Header>
          <Search placeholder="Search animations..." />
        </Header>

        {children}
      </body>
    </html>
  );
}
