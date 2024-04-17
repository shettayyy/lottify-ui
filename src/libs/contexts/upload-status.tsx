/**
 * Create a provider to track the count of files being uploaded and it will be used
 * to show a progress bar.
 * */
'use client';
import { createContext, PropsWithChildren, useContext, useState } from 'react';

import { Lottie } from '../types/lottie';

export type LottieUploadProgressStatus = {
  lottie: Lottie;
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
    setQueue((prevQueue: LottieUploadProgressStatus[]) => {
      const existingFile = prevQueue.find(
        f => f.lottie._id === file.lottie._id,
      );

      if (existingFile) {
        return prevQueue.map(f =>
          f.lottie._id === file.lottie._id ? { ...f, ...file } : f,
        );
      } else {
        const newQueue = [...prevQueue, file];
        setCount(newQueue.length);
        return newQueue;
      }
    });
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
