'use client';
import { useEffect } from 'react';

import {
  LottieUploadProgressStatus,
  useUploadStatus,
} from '@/libs/contexts/upload-status';
import useToggle from '@/libs/hooks/useToggle';

const UploadProgressMenu: React.FC = () => {
  const { queue, count, clearQueue } = useUploadStatus();
  const [isOpen, toggle] = useToggle(false);

  useEffect(() => {
    if (count > 0) {
      toggle();
    } else {
      toggle();
    }
  }, [count, toggle]);

  const handleClose = () => {
    clearQueue();
  };

  return (
    <>
      {isOpen && (
        <div className="fixed bottom-0 right-4 z-50 max-h-96 overflow-y-auto rounded-lg bg-white p-4 shadow-md">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold">Upload Progress</h2>
            <button onClick={handleClose}>
              <span className="text-xl">&#10060;</span>
            </button>
          </div>
          {queue.map((item: LottieUploadProgressStatus) => (
            <div
              key={item.animationId}
              className="mb-2 flex items-center justify-between"
            >
              <div className="mr-2">{item.filename}</div>
              {item.isTotalUnkown ? (
                <div className="h-2 w-16 rounded bg-gray-300">
                  <div
                    className="h-full rounded-full bg-blue-500"
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
              ) : (
                <div className="text-sm font-semibold">{item.progress}%</div>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default UploadProgressMenu;
