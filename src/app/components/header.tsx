'use client';
import Image from 'next/image';
import Link from 'next/link';
import { FC } from 'react';

type HeaderProps = {
  children?: React.ReactNode;
};

export const Header: FC<HeaderProps> = ({ children }) => {
  return (
    <header className="flex items-center justify-between px-2 py-4">
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

      {children}
    </header>
  );
};
