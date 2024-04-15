'use client';
import { CloudArrowUpIcon } from '@heroicons/react/16/solid';
import { AxiosProgressEvent } from 'axios';
import dynamic from 'next/dynamic';
import { useCallback } from 'react';

import Button from '@/libs/components/core/button';
import { Modal } from '@/libs/components/core/modal';
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

  const onUploadProgress = useCallback((progressEvent: AxiosProgressEvent) => {
    // Handle upload progress here
    const total = progressEvent.total; // Optional chaining used here
    const loaded = progressEvent.loaded;

    if (total !== undefined) {
      const progress = (loaded / total) * 100;
      console.info(`Upload progress: ${progress}%`);
    } else {
      console.info(`Upload progress: Total size unknown`);
    }
  }, []);

  // Upload the file to the cloud storage
  const uploadFileToCloud = useCallback(
    async (url: string, file: File) => {
      try {
        await uploadFileInChunksWithRetry({
          signedUrl: url,
          data: file,
          onUploadProgress,
        });
      } catch (error) {
        showToast('error', (error as Error).message);
      }
    },
    [onUploadProgress],
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
