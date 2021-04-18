import { Fragment, useCallback, useRef, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { CheckIcon, ExclamationIcon, BellIcon } from '@heroicons/react/outline';
import { useDialog } from '../../hooks/dialog';

export default function DialogModal() {
  const { dialog, closeDialog } = useDialog();
  const cancelButtonRef = useRef();

  const handleConfirm = useCallback(() => {
    if (dialog.action) {
      dialog.action();
    }
    closeDialog();
  }, [dialog, closeDialog]);

  const btnStyle = {
    info: 'bg-blue-400 hover:bg-blue-700 text-gray-100 focus:ring-blue-500',
    danger: 'bg-red-400 hover:bg-red-700 text-gray-100 focus:ring-red-500',
    success: 'bg-green-400 hover:bg-green-700 text-gray-700 focus:ring-green-500',
  }

  const iconStyle = {
    info: 'text-blue-400',
    danger: 'text-red-400',
    success: 'text-green-400',
  }

  return (
    <Transition.Root show={!!dialog} as={Fragment}>
      <Dialog
        as="div"
        static
        className="fixed z-10 inset-0 overflow-y-auto"
        initialFocus={cancelButtonRef}
        open={!!dialog}
        onClose={closeDialog}
      >
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-60 transition-opacity"/>
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div
              className="inline-block align-bottom bg-gray-700 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-gray-700 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div
                    className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-gray-600 sm:mx-0 sm:h-10 sm:w-10">
                    {dialog.type === 'success' && <CheckIcon className={`h-6 w-6 ${iconStyle[dialog.type]}`} aria-hidden="true"/>}
                    {dialog.type === 'danger' && <ExclamationIcon className={`h-6 w-6 ${iconStyle[dialog.type]}`} aria-hidden="true"/>}
                    {dialog.type === 'info' && <BellIcon className={`h-6 w-6 ${iconStyle[dialog.type]}`} aria-hidden="true"/>}
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-300">
                      {dialog.title}
                    </Dialog.Title>
                    <div className="mt-2">
                      {dialog.description && (
                        <p className="text-sm text-gray-400">
                          {dialog.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-600 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm ${btnStyle[dialog.type]}`}
                  onClick={handleConfirm}
                >
                  {dialog.options?.confirm || 'Confirm'}
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-700 shadow-sm px-4 py-2 bg-gray-600 text-base font-medium text-gray-300 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-600 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={closeDialog}
                  ref={cancelButtonRef}
                >
                  {dialog.options?.cancel || 'Cancel'}
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
