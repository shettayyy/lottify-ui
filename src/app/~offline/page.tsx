import { ExclamationTriangleIcon } from '@heroicons/react/24/solid';
import React from 'react';

const OfflineFallbackPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="flex animate-bounce items-center">
        <ExclamationTriangleIcon className="h-40 w-40 text-primary" />
      </div>

      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">You&apos;re Offline</h1>
        <p className="mb-4 text-lg">
          Don&apos;t worry! This app works offline too.
        </p>
        <p className="mb-8 text-lg">
          You can still access some content and features.
        </p>
      </div>
    </div>
  );
};

export default OfflineFallbackPage;
