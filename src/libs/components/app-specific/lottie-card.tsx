'use client';
import Axios from 'axios';
import PlayLottie, { LottieOptions } from 'lottie-react';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

import { Lottie } from '@/libs/types/lottie';
import { formatBytes } from '@/libs/utils/file';

export type LottieCardProps = {
  lottie?: Lottie;
  loading?: boolean;
};

export const LottieCard = ({ lottie, loading }: LottieCardProps) => {
  const [animation, setAnimation] =
    useState<LottieOptions['animationData']>(null);

  const loadAnimation = useCallback(async () => {
    if (loading || !lottie?.url) return;

    // clear params from url
    const url = lottie.url.split('?')[0];
    const { data } = await Axios.get(url, {
      responseType: 'json',
    });
    setAnimation(data);
  }, [loading, lottie?.url]);

  useEffect(() => {
    loadAnimation();
  }, [loadAnimation]);

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

  const formattedFilename = lottie.filename.replace(/[_-]/g, ' ');

  return (
    <Link
      href={`/${lottie._id}`}
      className="rounded-lg bg-neutral-800 shadow-lg"
    >
      <div className="p-4">
        <div className="mb-4">
          <h3 className="line-clamp-2 text-lg font-semibold capitalize">
            {formattedFilename}
          </h3>
          <p className="text-sm">{formatBytes(lottie.filesize)}</p>
        </div>

        <div className="relative h-56 w-full overflow-hidden">
          <PlayLottie
            animationData={animation}
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
