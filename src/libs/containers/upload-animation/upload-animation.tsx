'use client';
import { useMutation } from '@apollo/client';
import { CloudArrowUpIcon } from '@heroicons/react/16/solid';
import { AxiosProgressEvent } from 'axios';
import dynamic from 'next/dynamic';
import { useCallback } from 'react';

import Button from '@/libs/components/core/button';
import { Modal } from '@/libs/components/core/modal';
import { useUploadStatus } from '@/libs/contexts/upload-status';
import { SAVE_LOTTIE_METADATA } from '@/libs/graphql/mutations/upload';
import useToggle from '@/libs/hooks/useToggle';
import { Lottie, LottieMetadataInput } from '@/libs/types/lottie';
import { showToast } from '@/libs/utils/toast';
import { uploadFileInChunksWithRetry } from '@/libs/utils/upload';

const DynamicUploadModalBody = dynamic(
  () => import('./upload-modal-body').then(mod => mod.UploadModalBody),
  {
    loading: () => <p>Loading...</p>,
  },
);

export const UploadAnimation = () => {
  const [isOpen, toggle] = useToggle();
  const { updateQueue } = useUploadStatus();
  const [saveLottieMetadata] = useMutation<Lottie, LottieMetadataInput>(
    SAVE_LOTTIE_METADATA,
    {
      onError: error => {
        showToast('error', (error as Error).message);
      },
      refetchQueries: ['GetLotties'],
    },
  );

  const onUploadProgress = useCallback(
    (progressEvent: AxiosProgressEvent, lottie: Lottie) => {
      // Handle upload progress here
      const total = progressEvent.total || 0; // Optional chaining used here
      const loaded = progressEvent.loaded;

      let progress = 0;
      let isTotalUnkown = false;

      if (total) {
        progress = Math.round((loaded / total) * 100);
      } else {
        isTotalUnkown = true;
      }

      updateQueue({
        lottie,
        progress,
        isTotalUnkown,
        error: '',
      });
    },
    [updateQueue],
  );

  // Upload the file to the cloud storage
  const uploadFileToCloud = useCallback(
    async (lottie: Lottie, file: File) => {
      const { url, animationId, _id, filename } = lottie;

      try {
        // Upload the file in chunks
        await uploadFileInChunksWithRetry({
          signedUrl: url,
          data: file,
          onUploadProgress: progressEvent => {
            onUploadProgress(progressEvent, lottie);
          },
        });

        // This is a workaround to handle the case when the file size is not available
        // In our case, this should never happen though
        if (!file.size) {
          updateQueue({
            lottie,
            progress: 100,
            isTotalUnkown: true,
          });
        }

        // Start the metadata extraction process
        // User does not need to wait for this to complete
        saveLottieMetadata({
          variables: {
            input: {
              animationId,
              filename,
              _id,
            },
          },
        });
      } catch (error) {
        showToast('error', (error as Error).message);

        updateQueue({
          lottie,
          progress: 0,
          isTotalUnkown: false,
          error: (error as Error).message,
        });
      }
    },
    [onUploadProgress, saveLottieMetadata, updateQueue],
  );

  return (
    <>
      <Button
        className="flex items-center space-x-2"
        variant="filled"
        onClick={toggle}
      >
        <CloudArrowUpIcon className="h-5 w-5" />
        <span className="hidden md:flex">Upload animations</span>
      </Button>

      <Modal title="Upload animation" isOpen={isOpen} toggle={toggle}>
        <DynamicUploadModalBody
          onClose={toggle}
          uploadFileToCloud={uploadFileToCloud}
        />
      </Modal>
    </>
  );
};
