'use client';
import { CloudArrowUpIcon } from '@heroicons/react/16/solid';
import { AxiosProgressEvent } from 'axios';
import dynamic from 'next/dynamic';
import { useCallback } from 'react';

import Button from '@/libs/components/core/button';
import { Modal } from '@/libs/components/core/modal';
import { useUploadStatus } from '@/libs/contexts/upload-status';
import useToggle from '@/libs/hooks/useToggle';
import { showToast } from '@/libs/utils/toast';
import { uploadFileInChunksWithRetry } from '@/libs/utils/upload';

const DynamicUploadModal = dynamic(
  () => import('./upload-modal').then(mod => mod.UploadModal),
  {
    loading: () => <p>Loading...</p>,
  },
);

export const UploadAnimation = () => {
  const [isOpen, toggle] = useToggle();
  const { updateQueue } = useUploadStatus();

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
    async (url: string, animationId: string, file: File) => {
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

        showToast('success', 'File uploaded successfully');
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
    [onUploadProgress, updateQueue],
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
        <DynamicUploadModal uploadFileToCloud={uploadFileToCloud} />
      </Modal>
    </>
  );
};
