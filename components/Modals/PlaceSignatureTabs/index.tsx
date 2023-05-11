import { useTranslation } from 'next-i18next';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Document, Page } from 'react-pdf';
import Image from 'next/image';
import {
  PDFDocumentProxy,
  PDFPageProxy,
} from 'pdfjs-dist/types/src/display/api';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import Button from 'components/Buttons/Button';
import SignTab from './components/SignTab';
import DropArea from './components/DropArea';
import ArrowLeftRoundBlueIcon from 'public/images/icons/arrow-left-round-blue.svg';
import ArrowRightRoundBlueIcon from 'public/images/icons/arrow-right-round-blue.svg';
import { retrieveContractCall } from 'api/contract/retrieveContract';
import { saveContractTabDataCall } from 'api/contract/saveContractTabData';
import { sendToDocuSignCall } from 'api/contract/sendToDocuSign';
import {
  ContractTabData,
  ContractTabDataItem,
  SignTabEnum,
} from 'models/contract/saveContractTabData';
import CircleLoaderSpinner from 'components/CircleLoaderSpinner';
import customImageLoader from 'utils/image-loader';

export type PageSize = {
  width: number;
  height: number;
  page: PDFPageProxy;
};

interface Props {
  isOpen: boolean;
  closeModal: () => void;
  onSendAgreement: () => void;
  dealUuid: string;
  userUuid: string;
  baseTabPosition?: ContractTabData[];
  partySignerName?: string;
  counterpartySignerName?: string;
}

const PlaceSignatureTabs: React.FC<Props> = ({
  isOpen,
  closeModal,
  onSendAgreement,
  dealUuid,
  userUuid,
  baseTabPosition,
  partySignerName,
  counterpartySignerName,
}) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [numPages, setNumPages] = useState(0);
  const [pageSizes, setPageSizes] = useState<PageSize[]>([]);
  const [tabsPosition, setTabsPosition] = useState<ContractTabData[]>([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [contractUri, setContractUri] = useState('');
  const canvas = useRef(null);
  const arrayIndex = pageNumber - 1;
  const disablePrevPage = pageNumber <= 1;
  const disableNextPage = pageNumber >= numPages;
  const disableSaveButton = tabsPosition.every(
    (tabPosition) => !tabPosition.length
  );

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      setIsSent(false);
      setIsSubmitting(false);
      setContractUri('');
      getContract();
    }
  }, [isOpen]);

  useEffect(() => {
    setTabsPosition(baseTabPosition || []);
  }, [baseTabPosition]);

  const handleClose = () => {
    closeModal();
  };

  const getContract = async () => {
    const data = await retrieveContractCall({
      userUuid,
      dealUuid,
    });

    setContractUri(data.uri);
  };

  const handleDocumentLoadSuccess = async (pdf: PDFDocumentProxy) => {
    const newPageSizes: PageSize[] = [];
    const newTabsPosition: ContractTabData[] = [];

    for (let i = 0; i < pdf.numPages; i++) {
      const page = await pdf.getPage(pageNumber);
      newPageSizes.push({
        width: page.view[2],
        height: page.view[3],
        page,
      });
      newTabsPosition.push([]);
    }

    setPageNumber(1);
    setNumPages(pdf.numPages);
    setPageSizes(newPageSizes);
    if (!tabsPosition.length) setTabsPosition(newTabsPosition);
  };

  const handleDocumentLoadError = () => {
    setIsLoading(false);
  };

  const handlePageLoadSuccess = () => {
    setIsLoading(false);
  };

  const handleDrop = (positionItem: ContractTabDataItem) => {
    const newTabsPosition: ContractTabData[] = [...tabsPosition];

    if (newTabsPosition[arrayIndex]) {
      newTabsPosition[arrayIndex] = [...tabsPosition[arrayIndex]];
    } else {
      newTabsPosition[arrayIndex] = [];
    }

    newTabsPosition[arrayIndex].push({
      ...positionItem,
    });

    setTabsPosition(newTabsPosition);
  };

  const handleRemove = (index: number) => {
    const newTabsPosition: ContractTabData[] = [...tabsPosition];

    newTabsPosition[arrayIndex].splice(index, 1);

    setTabsPosition(newTabsPosition);
  };

  const handleClickPrevPage = () => {
    if (!disablePrevPage) {
      const prevPage = pageNumber - 1;
      setPageNumber(prevPage);
    }
  };

  const handleClickNextPage = () => {
    if (!disableNextPage) {
      const nextPage = pageNumber + 1;
      setPageNumber(nextPage);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      await saveContractTabDataCall({
        userUuid,
        dealUuid,
        tabData: JSON.stringify(tabsPosition),
      });

      setIsSent(true);
      onSendAgreement();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendDocuSign = async () => {
    setIsSubmitting(true);

    try {
      await saveContractTabDataCall({
        userUuid,
        dealUuid,
        tabData: JSON.stringify(tabsPosition),
      });

      await sendToDocuSignCall({
        userUuid,
        dealUuid,
      });

      setIsSent(true);
      onSendAgreement();
    } finally {
      setIsSubmitting(false);
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
                  {t('deal.arrange-the-signature-tabs')}
                </Dialog.Title>
                {!isSubmitting && !isSent && (
                  <DndProvider backend={HTML5Backend}>
                    <div className="flex mt-10 mb-20">
                      {!isLoading && (
                        <div className="w-10">
                          <SignTab
                            name={SignTabEnum.COUNTERPARTY}
                            signerName={counterpartySignerName}
                          />
                          <SignTab
                            name={SignTabEnum.PARTY}
                            signerName={partySignerName}
                          />
                        </div>
                      )}
                      <div className="flex items-center justify-center w-full">
                        <div>
                          <div className="relative">
                            {!isLoading && !!pageSizes.length && (
                              <DropArea
                                tabs={tabsPosition[arrayIndex]}
                                onDrop={handleDrop}
                                onRemoveTab={handleRemove}
                                partySignerName={partySignerName}
                                counterpartySignerName={counterpartySignerName}
                              />
                            )}
                            {(!isLoading || contractUri) && (
                              <Document
                                className="flex items-center justify-center"
                                file={contractUri}
                                onLoadSuccess={handleDocumentLoadSuccess}
                                onLoadError={handleDocumentLoadError}
                                loading=" "
                                noData=" "
                              >
                                {!!pageSizes.length && (
                                  <Page
                                    canvasRef={canvas}
                                    pageNumber={pageNumber}
                                    width={pageSizes[arrayIndex].width}
                                    onLoadSuccess={handlePageLoadSuccess}
                                    loading=" "
                                    noData=" "
                                  />
                                )}
                              </Document>
                            )}
                          </div>
                          {!isLoading && numPages > 1 && (
                            <p className="flex items-center justify-center mt-5 text-center">
                              <Image
                                alt=""
                                loader={customImageLoader}
                                className={`cursor-pointer ${
                                  disablePrevPage ? 'opacity-40' : ''
                                }`}
                                src={ArrowLeftRoundBlueIcon}
                                onClick={handleClickPrevPage}
                              />
                              <span className="ml-2 mr-2">
                                Page {pageNumber} of {numPages}
                              </span>
                              <Image
                                alt=""
                                loader={customImageLoader}
                                className={`cursor-pointer ${
                                  disableNextPage ? 'opacity-40' : ''
                                }`}
                                src={ArrowRightRoundBlueIcon}
                                onClick={handleClickNextPage}
                              />
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    {!isLoading && (
                      <div
                        className={
                          '!z-50 sm:fixed sm:left-0 sm:bottom-0 w-full  !bg-white !border-t-2 border-borderColor rounded-t-xl drop-shadow-[0_35px_35px_rgba(0,0,0,0.25)]'
                        }
                      >
                        <div className="flex items-center justify-end px-4 pt-5 pb-5 sm:px-10 lg:container lg:mx-auto">
                          <Button
                            onClick={handleSubmit}
                            disabled={disableSaveButton}
                            className="my-2 mr-2"
                            color="yellow"
                          >
                            {t('save-draft')}
                          </Button>
                          <Button
                            onClick={handleSendDocuSign}
                            disabled={disableSaveButton}
                            className="my-2 mr-2"
                          >
                            {t('confirm-and-send-to-docusign-button')}
                          </Button>
                        </div>
                      </div>
                    )}
                  </DndProvider>
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
                {(isSubmitting || isLoading) && (
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

export default PlaceSignatureTabs;
