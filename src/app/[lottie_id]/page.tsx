'use client';

import { useQuery } from '@apollo/client';
import LottiePlayer from 'lottie-react';
import { useCallback, useEffect } from 'react';

import Button from '@/libs/components/core/button';
import { GET_LOTTIE } from '@/libs/graphql/queries/lottie';
import { useLottieAnimation } from '@/libs/hooks/useLottieAnimation';
import { GetLottie, GetLottieInput } from '@/libs/types/lottie';
import { UploadStatus } from '@/libs/types/upload';
import { formatBytes, formatFilename } from '@/libs/utils/file';
import { showToast } from '@/libs/utils/toast';

type LottiePageProps = {
  params: {
    lottie_id: string;
  };
};

export default function LottiePage(props: LottiePageProps) {
  const { lottie_id } = props.params;
  const { data, loading, startPolling, stopPolling } = useQuery<
    GetLottie,
    GetLottieInput
  >(GET_LOTTIE, {
    variables: {
      input: {
        id: lottie_id,
      },
    },
    fetchPolicy: 'cache-and-network',
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

  useEffect(() => {
    // Start polling if data.lottie.uploadStatus is UPLOADING
    // Stop polling if data.lottie.uploadStatus is UPLOADED or FAILED
    // Stop polling after 5 minutes if data.lottie.uploadStatus is UPLOADING
    if (data?.lottie?.uploadStatus === UploadStatus.UPLOADING) {
      startPolling(5000);

      setTimeout(() => {
        stopPolling();
      }, 300000);
    } else {
      stopPolling();
    }
  }, [data?.lottie?.uploadStatus, startPolling, stopPolling]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!data?.lottie) {
    return <p>Lottie not found!</p>;
  }

  const { lottie } = data;

  const formattedFilename = formatFilename(lottie.filename);

  return (
    <main className="container mx-auto p-4">
      <div className="flex flex-col space-y-16">
        <div>
          <h1 className="text-center text-2xl font-semibold capitalize md:text-3xl">
            {formattedFilename}{' '}
          </h1>
          <span className="block text-center text-sm text-slate-500">
            ({formatBytes(lottie.filesize)})
          </span>
        </div>

        <div className="relative h-60 w-full overflow-hidden md:h-96">
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

        {lottie.uploadStatus === UploadStatus.UPLOADED && (
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
        )}

        {lottie.uploadStatus === UploadStatus.UPLOADING && (
          <p className="text-center text-lg font-semibold">
            Processing the animation. Metadata will be available soon...
          </p>
        )}

        {lottie.uploadStatus === UploadStatus.FAILED && (
          <p className="text-center text-lg font-semibold">
            Failed to process the animation metadata. We&apos;re working on it!
          </p>
        )}
      </div>
    </main>
  );
}
