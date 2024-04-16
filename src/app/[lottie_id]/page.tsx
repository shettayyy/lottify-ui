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
      <div>
        <p className="text-lg font-semibold">{label}:</p>
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
      <div className="mt-4 flex justify-end">
        <Button onClick={handleCopyUrl}>Copy URL</Button>
      </div>

      <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2">
        <LottiePlayer animationData={animationData} />

        <div className="grid grid-cols-2 gap-8">
          {renderMetaField('Filename', formattedFilename)}
          {renderMetaField('Author', lottie.metadata?.author)}
          {renderMetaField('Description', lottie.metadata?.description)}
          {renderMetaField('Size', formatBytes(lottie.filesize))}
          {renderMetaField(
            'Dimensions',
            `${lottie.metadata?.width ?? 0}x${lottie.metadata?.height ?? 0}`,
          )}
          {renderMetaField('Frame rate', lottie.metadata?.frameRate)}
          {renderMetaField('Duration', lottie.metadata?.duration)}
          {renderMetaField('Layers', lottie.metadata?.layerCount)}
          {renderMetaField('Total Frames', lottie.metadata?.totalFrames)}
          {renderMetaField('Generator', lottie.metadata?.generator)}
          {renderMetaField(
            'User-provided Filename',
            lottie.metadata?.userFilename,
          )}
        </div>
      </div>
    </main>
  );
}
