'use client';
import { DocumentArrowDownIcon } from '@heroicons/react/24/solid';
import PlayLottie from 'lottie-react';
import Link from 'next/link';

import { useLottieAnimation } from '@/libs/hooks/useLottieAnimation';
import { Lottie } from '@/libs/types/lottie';
import { formatBytes, formatFilename } from '@/libs/utils/file';

export type LottieCardProps = {
  lottie?: Lottie;
  loading?: boolean;
};

export const LottieCard = ({ lottie, loading }: LottieCardProps) => {
  const { animationData } = useLottieAnimation(lottie);

  const handleDownload = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();
    if (!lottie?.url) return;

    const downloadUrl = lottie.url.split('?')[0];
    const downloadFilename = `${lottie.filename}.json`;

    // Create a temporary link element
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = downloadFilename;

    // Simulate a click on the link to trigger the download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // if loading is true, show a loading card
  if (loading) {
    return (
      <div className="rounded-lg bg-neutral-800 shadow-lg">
        <div className="p-4">
          <div className="mb-4">
            <div className="h-4 w-1/2 animate-pulse rounded bg-neutral-700" />
            <div className="mt-2 h-4 w-1/4 animate-pulse rounded bg-neutral-700" />
          </div>

          <div className="relative h-56 w-full rounded bg-neutral-700" />
        </div>
      </div>
    );
  }

  if (!lottie) return null;

  const formattedFilename = formatFilename(lottie.filename);

  return (
    <Link
      href={`/${lottie._id}`}
      className="rounded-lg bg-neutral-800 shadow-lg"
    >
      <div className="p-4">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h3 className="line-clamp-2 text-lg font-semibold capitalize">
              {formattedFilename}
            </h3>
            <p className="text-sm">{formatBytes(lottie.filesize)}</p>
          </div>
          <button
            onClick={handleDownload}
            className="mt-1 text-neutral-400 transition duration-300 hover:text-neutral-200"
          >
            <DocumentArrowDownIcon className="h-6 w-6 text-primary" />
          </button>
        </div>

        <div className="relative h-56 w-full overflow-hidden">
          <PlayLottie
            animationData={animationData}
            width="100%"
            height="100%"
            className="absolute inset-0"
            loop
            autoplay
          />
        </div>
      </div>
    </Link>
  );
};
