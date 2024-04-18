'use client';
import Image from 'next/image';
import Link from 'next/link';
import { FC } from 'react';

import { useNetworkStatus } from '@/libs/hooks/useNetworkStatus';

type HeaderProps = {
  children?: React.ReactNode;
};

export const Header: FC<HeaderProps> = ({ children }) => {
  const { isOnline } = useNetworkStatus();

  return (
    <header className="sticky top-0 z-10 bg-neutral-800 shadow-lg">
      <div className="container m-auto flex items-center justify-between p-4 sm:px-2">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="logo/logo-icon.svg"
              alt="logo"
              width={0}
              height={0}
              className="h-8 w-8"
              priority
            />
            <Image
              src="logo/logo.svg"
              alt="logo"
              width={0}
              height={0}
              className="mt-1 hidden h-6 w-16 md:flex"
              priority
            />
          </Link>

          {/* Show offline status via red dot */}
          <div
            className={`h-2 w-2 rounded-full bg-red-500 ${
              isOnline ? 'hidden' : 'block'
            }`}
          />
        </div>

        {children}
      </div>
    </header>
  );
};
