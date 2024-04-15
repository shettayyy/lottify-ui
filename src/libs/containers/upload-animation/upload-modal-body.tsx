import { useMutation } from '@apollo/client';
import { DocumentArrowUpIcon } from '@heroicons/react/24/solid';
import { FC, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

import Button from '../../components/core/button';
import { GENERATE_LOTTIE_UPLOAD_URL } from '../../graphql/mutations/upload';
import {
  LottieSignedUploadURL,
  LottieUploadURLInput,
} from '../../types/lottie';
import { showToast } from '../../utils/toast';

export type UploadModalProps = {
  uploadFileToCloud: (
    url: string,
    animationId: string,
    file: File,
  ) => Promise<void>;
  onClose: () => void;
};

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

export const UploadModalBody: FC<UploadModalProps> = props => {
  const { uploadFileToCloud, onClose } = props;
  const [generateLottieUploadUrl, { loading }] = useMutation<
    LottieSignedUploadURL,
    LottieUploadURLInput
  >(GENERATE_LOTTIE_UPLOAD_URL);

  // Handle file drop event
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
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
          const { url, id } = data.generateUploadLottieURL;
          void uploadFileToCloud(url, id, file);
          onClose();
        },
      });
    },
    [generateLottieUploadUrl, onClose, uploadFileToCloud],
  );

  // Get the root props and input props for the dropzone component which will be used to upload the file
  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div {...getRootProps({ className: 'dropzone' })}>
      <div className="my-6 space-y-5 rounded-lg border-2 border-dashed border-gray-100 py-6">
        <input {...getInputProps()} />
        <DocumentArrowUpIcon className="mx-auto h-16 w-16 text-gray-300" />

        <div className="text-center">
          <p className="font-lf-bold text-base text-gray-300">Lottie JSON</p>
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
  );
};
