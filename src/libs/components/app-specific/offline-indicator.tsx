'use client';
import { useNetworkStatus } from '@/libs/hooks/useNetworkStatus';

const OfflineIndicator: React.FC = () => {
  const { isOnline } = useNetworkStatus();

  return (
    <div
      className={`fixed bottom-0 left-0 p-2 ${isOnline ? 'hidden' : 'block'} bg-red-500 text-white`}
    >
      You are offline.
    </div>
  );
};

export default OfflineIndicator;
