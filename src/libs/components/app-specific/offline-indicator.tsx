'use client';
import { useEffect, useState } from 'react';

const OfflineIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState<boolean>(true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div
      className={`fixed bottom-0 left-0 p-2 ${isOnline ? 'hidden' : 'block'} bg-red-500 text-white`}
    >
      You are offline.
    </div>
  );
};

export default OfflineIndicator;
