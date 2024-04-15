import Axios, { AxiosProgressEvent } from 'axios';

interface UploadParams {
  signedUrl: string;
  data: Blob; // Rename 'file' to 'data' to accommodate both chunks and entire files
  onUploadProgress: (progressEvent: AxiosProgressEvent) => void;
  maxAttempts?: number;
}

// Utility method to help uploadFileInChunks method to upload a chunk of a file to a signed URL
const uploadChunkWithRetry = async ({
  signedUrl,
  data: chunk,
  onUploadProgress,
  maxAttempts = 5,
}: UploadParams): Promise<void> => {
  let attempts = 0;

  while (attempts < maxAttempts) {
    try {
      await Axios.put(signedUrl, chunk, {
        headers: {
          'Content-Type': 'application/octet-stream',
        },
        onUploadProgress,
      });

      // If upload is successful, return
      return;
    } catch (error) {
      // Log error and retry
      console.error(`Upload attempt ${attempts + 1} failed:`, error);
    }

    attempts++;
  }

  // If maxAttempts is reached without successful upload, throw an error
  throw new Error(`Failed to upload chunk after ${maxAttempts} attempts`);
};

// Upload a file to a signed URL in chunks
// export const uploadFileInChunksWithRetry = async ({
//   signedUrl,
//   data: file,
//   onUploadProgress,
//   maxAttempts = 5,
// }: UploadParams): Promise<void> => {
//   const CHUNK_SIZE = 1024 * 1024; // 1MB chunk size
//   const fileSize = file.size;
//   let start = 0;

//   while (start < fileSize) {
//     const chunk = file.slice(start, start + CHUNK_SIZE);
//     await uploadChunkWithRetry({
//       signedUrl,
//       data: chunk,
//       onUploadProgress,
//       maxAttempts,
//     });
//     start += CHUNK_SIZE;
//   }
// };

// rewrite this uploadFileInChunksWithRetry function to provide upload progress of the entire file instead of individual chunks
export const uploadFileInChunksWithRetry = async ({
  signedUrl,
  data: file,
  onUploadProgress,
  maxAttempts = 5,
}: UploadParams): Promise<void> => {
  const CHUNK_SIZE = 500 * 1024; // 500 kb chunk size
  const fileSize = file.size;
  let start = 0;
  let totalUploaded = 0;

  while (start < fileSize) {
    const chunk = file.slice(start, start + CHUNK_SIZE);
    await uploadChunkWithRetry({
      signedUrl,
      data: chunk,
      onUploadProgress: progressEvent => {
        totalUploaded += progressEvent.loaded;

        onUploadProgress({
          ...progressEvent,
          loaded: totalUploaded,
          total: fileSize,
        });
      },
      maxAttempts,
    });
    start += CHUNK_SIZE;
  }
};
