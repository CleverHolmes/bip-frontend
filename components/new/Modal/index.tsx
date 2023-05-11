import React, { Fragment, MutableRefObject } from 'react';
import { Dialog, Transition } from '@headlessui/react';

import CircleLoaderSpinner from 'components/CircleLoaderSpinner';

type Props = {
  children: React.ReactNode;
  isOpen: boolean;
  closable?: boolean;
  loading?: boolean;
  title?: string;
  subTitle?: string;
  initialFocus?: MutableRefObject<HTMLElement | null>;
  closeModal: () => void;
};

const Modal: React.FC<Props> = ({
  children,
  isOpen,
  closable = true,
  loading,
  title,
  subTitle,
  initialFocus,
  closeModal,
}) => {
  function handleClose() {
    if (closable) closeModal();
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-100"
        initialFocus={initialFocus}
        onClose={handleClose}
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
        <div className="fixed inset-0 flex justify-center mx-auto overflow-y-auto">
          <div className="max-w-5xl">
            <div className="flex items-center justify-center min-h-full p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full h-full max-w-full max-h-full p-4 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl md:p-6 lg:p-20 rounded-2xl">
                  {title && (
                    <Dialog.Title
                      as="h3"
                      className="text-5xl font-bold font-custom1 text-primary"
                    >
                      {title}
                    </Dialog.Title>
                  )}
                  {subTitle && (
                    <div className="mt-2 text-lg font-normal md:text-2xl font-custom1 text-inputGray">
                      {subTitle}
                    </div>
                  )}
                  {!loading && <div className="mt-2">{children}</div>}
                  {loading && <CircleLoaderSpinner size={500} />}
                  {closable && (
                    <i
                      style={{
                        position: 'absolute',
                        top: '10px',
                        right: '20px',
                        cursor: 'pointer',
                        fontWeight: 300,
                        fontFamily: 'sans-serif',
                        fontStyle: 'normal',
                        zIndex: 100,
                      }}
                      onClick={closeModal}
                      className="text-[#7C8B9E] hover:text-button text-3xl lg:text-5xl"
                    >
                      x
                    </i>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default Modal;
