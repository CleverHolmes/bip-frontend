import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';

interface DialogProps {
  closeModal: () => void;
  isOpen: boolean;
  children?: React.ReactNode;
  dialogTitle?: string;
}

export const DialogModal = ({
  children,
  closeModal,
  isOpen,
  dialogTitle,
}: DialogProps) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        open={isOpen}
        onClose={() => closeModal()}
        className="relative z-100"
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-full p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <Dialog.Title
                  as="h3"
                  className={`text-2xl lg:text-4xl font-bold font-custom1 text-primary p-6 lg:p-20 border-b-2 border-[#E9E9E9]`}
                >
                  {dialogTitle}
                </Dialog.Title>
                {children}
                <i
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '30px',
                    cursor: 'pointer',
                    fontSize: '32px',
                    fontWeight: 300,
                    fontFamily: 'sans-serif',
                    fontStyle: 'normal',
                    zIndex: 100,
                  }}
                  onClick={closeModal}
                  className="text-[#7C8B9E] hover:text-button"
                >
                  x
                </i>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default DialogModal;
