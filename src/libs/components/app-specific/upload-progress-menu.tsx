'use client';
import { XMarkIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import { useEffect } from 'react';

import {
  LottieUploadProgressStatus,
  useUploadStatus,
} from '@/libs/contexts/upload-status';
import useToggle from '@/libs/hooks/useToggle';
import { formatFilename } from '@/libs/utils/file';

import CircularLoader from '../core/circular-loader';

const UploadProgressMenu: React.FC = () => {
  const { queue, count, clearQueue } = useUploadStatus();
  const [isOpen, , setIsOpen] = useToggle(false);

  useEffect(() => {
    if (count > 0) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [count, setIsOpen]);

  const handleClose = () => {
    clearQueue();
  };

  const renderProgress = (item: LottieUploadProgressStatus) => {
    if (item.progress === 100) {
      return (
        <Link
          href={`/${item.lottie._id}`}
          className="flex items-center justify-center space-x-2 rounded-md border border-transparent bg-teal-600 px-2 py-1 text-base font-medium text-white transition-all duration-300 hover:bg-teal-700"
        >
          View
        </Link>
      );
    }

    if (item.isTotalUnkown) {
      return <CircularLoader size={24} />;
    }

    return (
      <span className="text-sm font-semibold text-primary">
        {item.progress}%
      </span>
    );
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed bottom-0 right-4 z-50 max-h-96 w-64 rounded-lg bg-white p-4 shadow-md md:w-96">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Upload Progress</h2>

          <button onClick={handleClose}>
            <XMarkIcon className="h-5 w-5 text-slate-500" />
          </button>
        </div>

        <ul className="max-h-80 overflow-y-auto">
          {queue.map((item: LottieUploadProgressStatus) => (
            <li
              key={item.lottie._id}
              className="mb-2 flex items-center justify-between"
            >
              <div className="mr-2 capitalize text-neutral-500">
                {formatFilename(item.lottie.filename)}
              </div>

              {renderProgress(item)}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default UploadProgressMenu;
