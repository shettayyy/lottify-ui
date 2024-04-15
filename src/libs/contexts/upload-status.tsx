/**
 * Create a provider to track the count of files being uploaded and it will be used
 * to show a progress bar.
 * */
'use client';
import { createContext, PropsWithChildren, useContext, useState } from 'react';

export type LottieUploadProgressStatus = {
  animationId: string;
  filename: string;
  progress: number;
  isTotalUnkown: boolean;
  error?: string;
};

const UploadStatusContext = createContext<{
  queue: LottieUploadProgressStatus[];
  count: number;
  updateQueue: (file: LottieUploadProgressStatus) => void;
  clearQueue: () => void;
}>({
  queue: [],
  count: 0,
  updateQueue: () => {},
  clearQueue: () => {},
});

export const UploadStatusProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [queue, setQueue] = useState<LottieUploadProgressStatus[]>([]);
  const [count, setCount] = useState(0);

  const clearQueue = () => {
    setQueue([]);
    setCount(0);
  };

  const updateQueue = (file: LottieUploadProgressStatus) => {
    const existingFile = queue.find(f => f.animationId === file.animationId);

    if (existingFile) {
      setQueue(prevQueue =>
        prevQueue.map(f =>
          f.animationId === file.animationId ? { ...f, ...file } : f,
        ),
      );
    } else {
      setQueue(prevQueue => [...prevQueue, file]);
      setCount(prevCount => prevCount + 1);
    }
  };

  return (
    <UploadStatusContext.Provider
      value={{ queue, count, clearQueue, updateQueue }}
    >
      {children}
    </UploadStatusContext.Provider>
  );
};

export const useUploadStatus = () => useContext(UploadStatusContext);
