'use client';
import { CloudArrowUpIcon } from '@heroicons/react/16/solid';
import { DocumentArrowUpIcon } from '@heroicons/react/24/solid';
import { useDropzone } from 'react-dropzone';

import Button from '@/components/core/button';
import { Modal } from '@/components/core/modal';
import useToggle from '@/hooks/useToggle';
import { showToast } from '@/utils/toast';

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
  const onDrop = (acceptedFiles: File[]) => {
    const validation = validateFile(acceptedFiles[0]);

    if (!validation.status) {
      return showToast('error', validation.message);
    }

    // Handle file upload logic here
    console.info('Accepted files:', acceptedFiles);
  };

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

              <Button type="button">Browse</Button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};
