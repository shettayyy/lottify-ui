'use client';
import { ArrowPathIcon } from '@heroicons/react/24/solid';
import clsx from 'clsx';
import { FC } from 'react';

type CircularLoaderProps = {
  className?: string;
  size?: number;
};

const CircularLoader: FC<CircularLoaderProps> = ({ className, size = 24 }) => {
  return (
    <div className={clsx('flex items-center justify-center', className)}>
      <ArrowPathIcon
        className="animate-spin text-blue-500"
        width={size}
        height={size}
      />
    </div>
  );
};

export default CircularLoader;
