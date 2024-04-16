'use client';

import { useQuery } from '@apollo/client';
import LottiePlayer from 'lottie-react';
import { useCallback } from 'react';

import Button from '@/libs/components/core/button';
import { GET_LOTTIE } from '@/libs/graphql/queries/lottie';
import { useLottieAnimation } from '@/libs/hooks/useLottieAnimation';
import { GetLottie, GetLottieInput } from '@/libs/types/lottie';
import { formatBytes } from '@/libs/utils/file';
import { showToast } from '@/libs/utils/toast';

type LottiePageProps = {
  params: {
    lottie_id: string;
  };
};

export default function LottiePage(props: LottiePageProps) {
  const { lottie_id } = props.params;
  const { data, loading } = useQuery<GetLottie, GetLottieInput>(GET_LOTTIE, {
    variables: {
      input: {
        id: lottie_id,
      },
    },
    onError(error) {
      showToast('error', error.message);
    },
  });
  const { animationData } = useLottieAnimation(data?.lottie);

  const handleCopyUrl = useCallback(() => {
    if (!data?.lottie?.url) return;

    navigator.clipboard.writeText(data.lottie.url.split('?')[0]);
    showToast('success', 'URL copied to clipboard');
  }, [data?.lottie?.url]);

  const renderMetaField = (label: string, value?: string | number) => {
    if (!value) return null;

    return (
      <div className="flex flex-col items-center">
        <p className="text-lg font-semibold">{label}</p>
        <p className="capitalize text-gray-400">{value}</p>
      </div>
    );
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!data?.lottie) {
    return <p>Lottie not found!</p>;
  }

  const { lottie } = data;

  const formattedFilename = lottie.filename.replace(/[_-]/g, ' ');

  return (
    <main className="container mx-auto p-4">
      <div className="flex flex-col space-y-16">
        <h1 className="text-center text-3xl font-semibold capitalize">
          {formattedFilename}{' '}
          <span className="text-sm text-slate-500">
            ({formatBytes(lottie.filesize)})
          </span>
        </h1>

        <div className="relative h-96 w-full overflow-hidden">
          <LottiePlayer
            animationData={animationData}
            width="100%"
            height="auto"
            className="absolute inset-0"
          />
        </div>

        <div className="flex justify-center">
          <Button type="button" onClick={handleCopyUrl}>
            Copy URL
          </Button>
        </div>

        <div className="m-auto grid max-w-screen-lg grid-cols-2 gap-8 md:grid-cols-4">
          {renderMetaField('Author', lottie.metadata?.author)}
          {renderMetaField('Description', lottie.metadata?.description)}
          {renderMetaField(
            'Dimensions',
            `${lottie.metadata?.width ?? 0}x${lottie.metadata?.height ?? 0}`,
          )}
          {renderMetaField('Frame rate', lottie.metadata?.frameRate)}
          {renderMetaField('Duration', lottie.metadata?.duration)}
          {renderMetaField('Layers', lottie.metadata?.layerCount)}
          {renderMetaField('Total Frames', lottie.metadata?.totalFrames)}
        </div>
      </div>
    </main>
  );
}
