'use client';
import { XMarkIcon } from '@heroicons/react/16/solid';
import { clsx } from 'clsx';
import { FC } from 'react';

type SearchProps = {
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  onClear?: () => void;
  value?: string;
  onChange?: (value: string) => void;
};

export const Search: FC<SearchProps> = ({
  placeholder = 'Search...',
  className,
  inputClassName,
  onClear,
  value,
  onChange,
}) => {
  return (
    <div className={clsx('relative flex items-center', className)}>
      <input
        type="text"
        placeholder={placeholder}
        className={clsx(
          'rounded-full px-4 py-2 text-black outline-none transition-all duration-300 md:w-2/4',
          inputClassName,
        )}
        id="lottie-list-search-input"
        value={value}
        onChange={e => onChange?.(e.target.value)}
      />

      <button className="absolute right-2" onClick={onClear}>
        <XMarkIcon className="h-6 w-6 text-gray-700" />
      </button>
    </div>
  );
};
