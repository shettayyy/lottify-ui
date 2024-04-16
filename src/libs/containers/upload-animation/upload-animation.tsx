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
    },
  );

  const onUploadProgress = useCallback(
    (progressEvent: AxiosProgressEvent, animationId: string, file: File) => {
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
        animationId,
        filename: file.name,
        progress,
        isTotalUnkown,
      });
    },
    [updateQueue],
  );

  // Upload the file to the cloud storage
  const uploadFileToCloud = useCallback(
    async (lottie: Lottie, file: File) => {
      const { url, animationId, _id, filename } = lottie;

      try {
        await uploadFileInChunksWithRetry({
          signedUrl: url,
          data: file,
          onUploadProgress: progressEvent => {
            onUploadProgress(progressEvent, animationId, file);
          },
        });

        // This is a workaround to handle the case when the file size is not available
        if (!file.size) {
          updateQueue({
            animationId,
            filename: file.name,
            progress: 100,
            isTotalUnkown: true,
          });
        }

        // Start the metadata extraction process
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
          animationId,
          filename: file.name,
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
