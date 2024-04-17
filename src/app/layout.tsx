import './globals.css';

import type { Metadata, Viewport } from 'next';
import { Inter, Quicksand } from 'next/font/google';

import OfflineIndicator from '@/libs/components/app-specific/offline-indicator';
import PWAInstallPrompt from '@/libs/components/app-specific/pwa-install-prompt';
import { PWALifeCycle } from '@/libs/components/app-specific/pwa-lifecycle';
import UploadProgressMenu from '@/libs/components/app-specific/upload-progress-menu';
import { Header } from '@/libs/components/layout/header';
import { UploadAnimation } from '@/libs/containers/upload-animation/upload-animation';
import { ApolloProvider } from '@/libs/contexts/apollo-client';
import StoreProvider from '@/libs/contexts/store';
import ToastProvider from '@/libs/contexts/toastify';
import { UploadStatusProvider } from '@/libs/contexts/upload-status';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});
const quicksand = Quicksand({
  subsets: ['latin'],
  variable: '--font-quicksand',
});

const APP_NAME = 'Lottify';
const APP_DESCRIPTION =
  'Lightweight, scalable animations for your websites and apps';

export const metadata: Metadata = {
  manifest: '/manifest.json',
  title: APP_NAME,
  applicationName: APP_NAME,
  description: APP_DESCRIPTION,
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: APP_NAME,
  },
  formatDetection: {
    telephone: false,
  },
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

export const viewport: Viewport = {
  themeColor: '#00DDB3',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${quicksand.variable}`}>
      {/* suppressHydrationWarning suppresses warning related to colorzilla */}
      <body
        className={'bg-neutral-900 font-inter text-slate-100'}
        suppressHydrationWarning={true}
      >
        <PWALifeCycle />

        <ApolloProvider>
          <StoreProvider>
            <ToastProvider>
              <UploadStatusProvider>
                <Header>
                  <UploadAnimation />
                  {/* <h4 className="font-quicksand text-base">
                    Made with{' '}
                    <span role="img" aria-label="heart">
                      ❤️
                    </span>{' '}
                    for{' '}
                    <span className="animate-pulse text-primary">
                      LottieFiles
                    </span>
                  </h4> */}
                </Header>

                {children}
                {/* Render the upload progress menu */}
                <UploadProgressMenu />
              </UploadStatusProvider>
            </ToastProvider>
          </StoreProvider>
        </ApolloProvider>

        <PWAInstallPrompt />
        <OfflineIndicator />
      </body>
    </html>
  );
}
