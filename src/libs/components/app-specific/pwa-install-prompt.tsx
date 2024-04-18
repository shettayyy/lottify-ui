'use client';
import { Dialog } from '@headlessui/react';
import { FolderPlusIcon } from '@heroicons/react/24/solid';
import { useEffect, useState } from 'react';

interface DeferredPrompt extends Event {
  prompt: () => void;
  userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
  }>;
}

const PWAInstallPrompt: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: Event) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      event.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(event);
      // const lastInteraction = localStorage.getItem(
      //   'installPromptLastInteraction',
      // );
      // const lastInteractionTime = lastInteraction
      //   ? parseInt(lastInteraction, 10)
      //   : 0;
      // const now = Date.now();
      // if (
      //   !lastInteractionTime ||
      //   now - lastInteractionTime > 2 * 24 * 60 * 60 * 1000
      // ) {
      //   setIsOpen(true); // Show the install prompt
      // }

      setIsOpen(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt,
      );
    };
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      // Show the install prompt
      (deferredPrompt as DeferredPrompt).prompt();
      // Wait for the user to respond to the prompt
      (deferredPrompt as DeferredPrompt).userChoice.then(choiceResult => {
        if (choiceResult.outcome === 'accepted') {
          console.info('User accepted the install prompt');
        } else {
          console.info('User dismissed the install prompt');
        }
        // Reset the deferredPrompt
        setDeferredPrompt(null);
        setIsOpen(false);
      });
    }
  };

  const handleCancelClick = () => {
    setIsOpen(false);
    // localStorage.setItem('installPromptLastInteraction', Date.now().toString());
  };

  return (
    <Dialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      className="fixed inset-0 z-10 overflow-y-auto"
    >
      <div className="flex min-h-screen items-end justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0">
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

        <span
          className="hidden sm:inline-block sm:h-screen sm:align-middle"
          aria-hidden="true"
        >
          &#8203;
        </span>

        <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
          <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                <FolderPlusIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Install App
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Do you want to install this app on your device for a better
                    experience?
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <button
              onClick={handleInstallClick}
              type="button"
              className="inline-flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Install
            </button>
            <button
              onClick={handleCancelClick}
              type="button"
              className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:ml-3 sm:mt-0 sm:w-auto sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default PWAInstallPrompt;
