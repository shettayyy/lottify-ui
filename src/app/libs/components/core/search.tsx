'use client';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/16/solid';
import { clsx } from 'clsx';
import { FC } from 'react';

import useToggle from '@/libs/hooks/useToggle';

type SearchProps = {
  placeholder?: string;
};

export const Search: FC<SearchProps> = ({ placeholder = 'Search...' }) => {
  const [isSearchBarOpen, toggle] = useToggle();
  return (
    <div className="relative flex w-full items-center justify-end">
      <input
        type="text"
        placeholder={placeholder}
        className={clsx(
          'w-4/5 rounded-full px-4 py-2 text-black outline-none transition-all duration-300 md:w-2/4',
          {
            'visible opacity-100': isSearchBarOpen,
            'invisible opacity-0 md:visible md:opacity-100': !isSearchBarOpen,
          },
        )}
      />
      <button className="absolute right-0 md:hidden" onClick={toggle}>
        {isSearchBarOpen ? (
          <XMarkIcon className="h-8 w-8 text-gray-700" />
        ) : (
          <MagnifyingGlassIcon className="h-8 w-8 text-primary" />
        )}
      </button>
    </div>
  );
};
