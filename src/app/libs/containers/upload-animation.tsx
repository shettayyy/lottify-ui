'use client';
import { useMutation } from '@apollo/client';
import { CloudArrowUpIcon } from '@heroicons/react/16/solid';
import { DocumentArrowUpIcon } from '@heroicons/react/24/solid';
import { useDropzone } from 'react-dropzone';

import Button from '@/libs/components/core/button';
import { Modal } from '@/libs/components/core/modal';
import { GENERATE_LOTTIE_UPLOAD_URL } from '@/libs/graphql/mutations/upload';
import useToggle from '@/libs/hooks/useToggle';
import {
  LottieSignedUploadURL,
  LottieUploadURLInput,
} from '@/libs/types/lottie';
import { showToast } from '@/libs/utils/toast';

import { uploadFileInChunksWithRetry } from '../utils/upload';

// Validate the file type, size and empty file. If validation fails, send the message and status (true/false)
const validateFile = (file: File) => {
  if (!file) {
    return {
      status: false,
      message: 'No file uploaded! Please upload a JSON file.',
    };
  }

  if (file.size > 20 * 1024 * 1024) {
    return {
      status: false,
      message: 'File size is too large! Max file size is 20 MB.',
    };
  }

  if (file.type !== 'application/json') {
    return {
      status: false,
      message: 'Invalid file type! Please upload a JSON file.',
    };
  }

  return { status: true, message: '' };
};

export const UploadAnimation = () => {
  const [isOpen, toggle] = useToggle();
  const uploadFileToCloud = async (url: string, file: File) => {
    try {
      await uploadFileInChunksWithRetry(url, file);
      showToast('success', 'File uploaded successfully!');
    } catch (error) {
      showToast('error', (error as Error).message);
    }
  };
  const [generateLottieUploadUrl, { loading }] = useMutation<
    LottieSignedUploadURL,
    LottieUploadURLInput
  >(GENERATE_LOTTIE_UPLOAD_URL);

  // Handle file drop event
  const onDrop = (acceptedFiles: File[]) => {
    const validation = validateFile(acceptedFiles[0]);

    if (!validation.status) {
      return showToast('error', validation.message);
    }

    const file = acceptedFiles[0];

    // Handle file upload logic here
    generateLottieUploadUrl({
      variables: {
        input: {
          filename: file.name,
        },
      },
      onError: error => {
        showToast('error', error.message);
      },
      onCompleted: data => {
        void uploadFileToCloud(data.generateUploadLottieURL.url, file);
      },
    });
  };

  // Get the root props and input props for the dropzone component which will be used to upload the file
  const { getRootProps, getInputProps } = useDropzone({ onDrop });

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
        <div {...getRootProps({ className: 'dropzone' })}>
          <div className="my-6 space-y-5 rounded-lg border-2 border-dashed border-gray-100 py-6">
            <input {...getInputProps()} />
            <DocumentArrowUpIcon className="mx-auto h-16 w-16 text-gray-300" />

            <div className="text-center">
              <p className="font-lf-bold text-base text-gray-300">
                Lottie JSON
              </p>
              <p className="text-xs text-gray-300">Max file size: 20 MB each</p>
            </div>

            <div className="flex flex-col items-center">
              <p className="text-center text-xl font-bold text-gray-600">
                Drag &amp; drop animations to upload
              </p>
              <span className="mb-2 text-gray-600">or</span>

              <Button type="button">
                {loading ? 'Uploading...' : 'Select file'}
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};
