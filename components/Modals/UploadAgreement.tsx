import { useTranslation } from 'next-i18next';
import React, { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';

import FileUploadField, { FileBase64Type } from 'components/FileUploadField';
import { onlyPdf } from 'constants/acceptedFiles';
import Button from 'components/Buttons/Button';
import { uploadContractBase64Call } from 'api/contract/uploadContractBase64';
import CircleLoaderSpinner from 'components/CircleLoaderSpinner';

interface Props {
  isOpen: boolean;
  closeModal: () => void;
  onUpload: () => void;
  userUuid: string;
  dealUuid: string;
  showExtraText: boolean;
}

const UploadAgreement: React.FC<Props> = ({
  isOpen,
  closeModal,
  onUpload,
  userUuid,
  dealUuid,
  showExtraText,
}) => {
  const { t } = useTranslation();
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [uploadedBase64Files, setUploadedBase64Files] = useState<
    FileBase64Type[]
  >([]);
  const [uploadedFilesError, setUploadedFilesError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const disabledButton = uploadedFilesError || !uploadedBase64Files.length;

  const uploadFiles = (files: File[]) => {
    setUploadedFiles(files);
  };

  const uploadBase64Files = (files: FileBase64Type[]) => {
    setUploadedBase64Files(files);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setUploadedFilesError(false);

    try {
      await uploadContractBase64Call({
        fileContentsBase64String:
          uploadedBase64Files[0].fileContentsBase64String,
        filenameOriginal: uploadedBase64Files[0].filenameOriginal,
        userUuid,
        dealUuid,
      });

      setIsSent(true);
      onUpload();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    closeModal();

    if (isSent) {
      setUploadedFiles([]);
      setUploadedBase64Files([]);
      setIsSent(false);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={handleClose}>
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
        <div className="fixed inset-0 max-w-5xl mx-auto overflow-y-auto">
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
              <Dialog.Panel className="w-full h-full max-w-full max-h-full px-6 pt-20 pb-6 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl lg:p-20 rounded-2xl">
                <Dialog.Title
                  as="h3"
                  className="text-3xl md:text-5xl font-bold font-custom1 text-primary`"
                >
                  {t('deal.upload-an-agreement')}
                </Dialog.Title>
                <div></div>
                {showExtraText && (
                  <div className="my-5 text-base text-red-400 font-custom2">
                    *{t('deal.agreement-note')}
                  </div>
                )}
                {!isSubmitting && !isSent && (
                  <div>
                    <div className="pb-10 mt-10 mb-10">
                      <FileUploadField
                        uploadFiles={uploadFiles}
                        uploadBase64Files={uploadBase64Files}
                        files={uploadedFiles}
                        isBase64
                        acceptedFileTypes={onlyPdf}
                        allowMultiple={false}
                        errorText={
                          uploadedFilesError
                            ? t('errors:you-need-to-upload-at-least-one-file')
                            : ''
                        }
                      />
                    </div>

                    <div
                      className={
                        '!z-50 sm:fixed sm:left-0 sm:bottom-0 w-full  !bg-white !border-t-2 border-borderColor rounded-t-xl drop-shadow-[0_35px_35px_rgba(0,0,0,0.25)]'
                      }
                    >
                      <div className="flex items-center justify-end px-4 pt-5 pb-5 sm:px-10 lg:container lg:mx-auto">
                        <Button
                          onClick={handleSubmit}
                          disabled={disabledButton}
                          className="my-2 mr-2"
                        >
                          {t('confirm-and-send-button')}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
                {isSent && (
                  <div className="flex flex-col items-center">
                    <div className="px-4 py-2 mt-20 mb-10 mr-5 text-lg text-primary font-custom1">
                      {t('deal.your-agreement-has-been-submitted')}
                    </div>
                    <Button onClick={handleClose} className="text-center">
                      {t('close')}
                    </Button>
                  </div>
                )}
                {isSubmitting && (
                  <CircleLoaderSpinner size={250} className="mt-10" />
                )}
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
                  onClick={handleClose}
                  className="text-[#7C8B9E] hover:text-button text-3xl lg:text-5xl"
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

export default UploadAgreement;
