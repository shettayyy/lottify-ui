// Utility method to help uploadFileInChunks method to upload a chunk of a file to a signed URL
const uploadChunkWithRetry = async (
  signedUrl: string,
  chunk: Blob,
  maxAttempts = 5,
): Promise<void> => {
  let attempts = 0;

  while (attempts < maxAttempts) {
    try {
      await fetch(signedUrl, {
        method: 'PUT',
        body: chunk,
        headers: {
          'Content-Type': 'application/octet-stream',
        },
      });

      // If upload is successful, return
      return;
    } catch (error) {
      console.error(`Upload attempt ${attempts + 1} failed:`, error);
    }

    attempts++;
  }

  // If maxAttempts is reached without successful upload, throw an error
  throw new Error(`Failed to upload chunk after ${maxAttempts} attempts`);
};

// Upload a file to a signed URL in chunks
export const uploadFileInChunksWithRetry = async (
  signedUrl: string,
  file: File,
  maxAttempts = 5,
): Promise<void> => {
  const CHUNK_SIZE = 1024 * 1024; // 1MB chunk size
  const fileSize = file.size;
  let start = 0;

  while (start < fileSize) {
    const chunk = file.slice(start, start + CHUNK_SIZE);
    await uploadChunkWithRetry(signedUrl, chunk, maxAttempts);
    start += CHUNK_SIZE;
  }
};
