import { Dialog, Transition } from '@headlessui/react';
import dayjs from 'dayjs';
import React, { Fragment, useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import ChevronDownIcon from '@heroicons/react/20/solid/ChevronDownIcon';
import ReactDiffViewer from 'react-diff-viewer';

import useStore from 'modules/Store';
import {
  CustomType,
  DealResponse,
  DealAttachmentsResponse,
} from 'models/deals/deals';
import UploadedFileSmaller from 'components/UploadedFileSmaller';
import { convertedImageLogo } from 'public/helpers/convertedImageLogo';
import InfoBox from 'components/InfoBox';
import CircleLoaderSpinner from 'components/CircleLoaderSpinner';
import useTokensOrCookies from 'contexts/TokensOrCookies';

type EditorProps = {
  isOpen: boolean;
  closeModal: () => void;
  dealID: string;
  revisionNumber: number;
  deals: DealResponse[];
  files: DealAttachmentsResponse[];
};

const DealMemoViewer: React.FC<EditorProps> = ({
  isOpen,
  closeModal,
  dealID,
  revisionNumber,
  deals,
  files,
}) => {
  const userUUID = useStore((state) => state.userUUID);
  const { t } = useTranslation();
  const { companyRepresented } = useTokensOrCookies();
  const [dealRevisionResponse, setDealRevisionResponse] =
    useState<DealResponse>();
  const [dealOldResponse, setDealOldResponse] = useState<DealResponse>();

  const [numberOfExtraLines, setNumberOfExtraLines] = useState(0);
  const [extraContentKeys, setExtraContentKeys] = useState<any>([]);
  const [extraContentValues, setExtraContentValues] = useState<any>([]);
  const [extraContentValuesOld, setExtraContentValuesOld] = useState<any>([]);
  const [dealRevisionNumber, setDealRevisionNumber] =
    useState<number>(revisionNumber);

  useEffect(() => {
    if (deals && deals.length) {
      const dealRes = deals[deals.length - 1];
      setExtraContentKeys(
        dealRes.custom_fields.map((value: CustomType) => value.fieldName)
      );
      setExtraContentValues(
        dealRes.custom_fields.map((value: CustomType) => value.fieldValue)
      );
      dealOldResponse &&
        setExtraContentValuesOld(
          dealOldResponse.custom_fields.map(
            (value: CustomType) => value.fieldValue
          )
        );
      setNumberOfExtraLines(dealRes.custom_fields.length);
    }
  }, [companyRepresented, userUUID, dealID, deals, dealOldResponse]);

  useEffect(() => {
    if (deals && deals.length) {
      const deal = deals.filter(
        (deal2) => deal2.revision === dealRevisionNumber
      );
      const dealResOld =
        deals.length >= 2 ? deals[deals.length - 2] : undefined;
      setDealRevisionResponse(deal[0]);
      dealResOld && setDealOldResponse(dealResOld);
      setExtraContentKeys(
        deal[0].custom_fields.map((value: CustomType) => value.fieldName)
      );
      setExtraContentValues(
        deal[0].custom_fields.map((value: CustomType) => value.fieldValue)
      );
    }
  }, [dealRevisionNumber, deals]);

  useEffect(() => {
    setDealRevisionNumber(revisionNumber);
  }, [revisionNumber]);

  const editDealNumber = (direction: string) => {
    // using instead of boolean if we want to add a reset
    if (deals && deals.length) {
      if (direction === 'increase') {
        dealRevisionNumber < deals.length - 1 &&
          setDealRevisionNumber(dealRevisionNumber + 1);
      } else if (direction === 'decrease') {
        dealRevisionNumber > 0 && setDealRevisionNumber(dealRevisionNumber - 1);
      }
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={closeModal}>
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
              <Dialog.Panel className="w-full h-full max-w-full max-h-full px-4 pt-20 pb-6 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl lg:p-20 rounded-2xl">
                <Dialog.Title
                  as="h3"
                  className="text-3xl md:text-5xl font-bold font-custom1 text-primary`"
                >
                  Deal Memo Viewer
                </Dialog.Title>
                {dealRevisionResponse && userUUID ? (
                  <>
                    <div className="mt-2">
                      {dealRevisionResponse &&
                        dealRevisionResponse.description && (
                          <>
                            <div className="mt-10 mb-4 text-xl font-bold font-custom1 lg:text-3xl text-primary">
                              Description:
                            </div>
                            <div className="mb-6 text-base font-custom1 text-blueText">
                              {dealRevisionResponse.description}
                            </div>
                          </>
                        )}
                    </div>
                    {files && files.length > 0 && (
                      <>
                        <div className="mt-10 mb-4 text-xl font-bold font-custom1 lg:text-3xl text-primary">
                          Files:
                        </div>
                        <div className="mb-6 text-base font-custom1 text-blueText">
                          <div className="flex flex-wrap">
                            {files.map((item) => {
                              let image = convertedImageLogo(item.uri);
                              return (
                                <UploadedFileSmaller
                                  image={image}
                                  title={item.filename_original}
                                  uri={item.uri}
                                  key={item.uri}
                                  deleteCapable={false}
                                />
                              );
                            })}
                          </div>
                        </div>
                      </>
                    )}
                    <div className="max-w-3xl mt-10 mb-6 text-xl font-bold font-custom1 lg:text-3xl text-primary lg:mb-8">
                      {t('deal.deal-specifics')}
                    </div>
                    {dealRevisionResponse && (
                      <div className="max-w-4xl mb-10">
                        <div className="hidden mt-6 lg:grid lg:grid-cols-9">
                          <div className="ml-3 font-bold lg:col-span-3 font-custom1 text-inputGray">
                            {t('deal-details')}
                          </div>
                          <div className="flex items-center ml-3 font-bold lg:col-span-6 font-custom1 text-inputGray">
                            {dealRevisionNumber > 0 && (
                              <ChevronDownIcon
                                className={`hover:text-button active:text-button mr-2 h-5 w-5 text-inputGray transition duration-150 ease-in-out group-hover:text-opacity-80 rotate-90 cursor-pointer`}
                                aria-hidden="true"
                                onClick={() => editDealNumber('decrease')}
                              />
                            )}
                            {t('deal-memo-editor.revision')}{' '}
                            {dealRevisionNumber + 1}{' '}
                            {dealRevisionNumber === 0
                              ? ' - Original Deal'
                              : dealRevisionNumber === deals.length - 1
                              ? ' - Current Deal'
                              : ''}
                            {deals && dealRevisionNumber < deals.length - 1 && (
                              <ChevronDownIcon
                                className={`hover:text-button active:text-button ml-2 h-5 w-5 text-inputGray transition duration-150 ease-in-out group-hover:text-opacity-80 -rotate-90 cursor-pointer`}
                                aria-hidden="true"
                                onClick={() => editDealNumber('increase')}
                              />
                            )}
                          </div>
                        </div>
                        <div className="mt-2 mb-20 bg-white border-4 lg:grid lg:grid-cols-9 border-button text-blueText">
                          <div className="p-2 border-2 lg:col-span-3 border-button">
                            {t('date')}:
                          </div>
                          <div className="border-2 lg:col-span-6 border-button bg-backgroundInput">
                            <div className="p-2">
                              {dayjs(new Date()).format('MMM DD, YYYY')}
                            </div>
                          </div>
                          <div className="p-2 border-2 lg:col-span-3 border-button">
                            {t('deal.party')} 1:
                          </div>
                          <div className="border-2 lg:col-span-6 border-button bg-backgroundInput">
                            <div className="p-2">
                              {dealRevisionResponse.user.company_name}
                            </div>
                          </div>
                          <div className="p-2 border-2 lg:col-span-3 border-button">
                            {t('deal.party')} 2:
                          </div>
                          <div className="border-2 lg:col-span-6 border-button bg-backgroundInput">
                            <div className="p-2">
                              {dealRevisionResponse.counterparty.company_name}
                            </div>
                          </div>
                          {dealRevisionResponse.deal_type ===
                            'Collaboration' && (
                            <>
                              <div className="p-2 border-2 lg:col-span-3 border-button">
                                {t('deal.collaboration-brand')}:
                              </div>
                              <div className="border-2 lg:col-span-6 border-button bg-backgroundInput">
                                <div className="p-2">
                                  {
                                    dealRevisionResponse.collaboration_item
                                      ?.name
                                  }
                                </div>
                              </div>
                            </>
                          )}
                          <div className="p-2 border-2 border-r-2 lg:col-span-3 border-button">
                            1. {t('listing')}:
                          </div>
                          <div className="border-2 lg:col-span-6 border-button bg-backgroundInput">
                            <div className="p-2">
                              {dealRevisionResponse.property || '-'}
                            </div>
                          </div>
                          <div className="p-2 border-2 lg:col-span-3 border-button">
                            2. {t('deal.exclusive')}:
                          </div>
                          <div
                            className={`border-2 lg:col-span-6 border-button bg-backgroundInput`}
                          >
                            <div className="p-2">
                              {dealRevisionResponse.exclusive || '-'}
                              {dealOldResponse &&
                                dealRevisionNumber === deals.length - 1 &&
                                dealOldResponse.exclusive !==
                                  dealRevisionResponse.exclusive && (
                                  <ReactDiffViewer
                                    oldValue={dealOldResponse.exclusive}
                                    newValue={dealRevisionResponse.exclusive}
                                    splitView={false}
                                    disableWordDiff={true}
                                    hideLineNumbers={true}
                                  />
                                )}
                            </div>
                          </div>
                          <div className="p-2 border-2 lg:col-span-3 border-button">
                            3. {t('product-categories')}:
                          </div>
                          <div
                            className={
                              'border-2 lg:col-span-6 border-button bg-backgroundInput'
                            }
                          >
                            <div className="p-2">
                              {dealRevisionResponse.categories || '-'}
                              {dealOldResponse &&
                                dealRevisionNumber === deals.length - 1 &&
                                dealOldResponse.categories !==
                                  dealRevisionResponse.categories && (
                                  <ReactDiffViewer
                                    oldValue={dealOldResponse.categories}
                                    newValue={dealRevisionResponse.categories}
                                    splitView={false}
                                    disableWordDiff={true}
                                    hideLineNumbers={true}
                                  />
                                )}
                            </div>
                          </div>
                          <div className="p-2 border-2 lg:col-span-3 border-button">
                            4. {t('deal.territory')}:
                          </div>
                          <div
                            className={
                              'border-2 lg:col-span-6 border-button bg-backgroundInput'
                            }
                          >
                            <div className="p-2">
                              {dealRevisionResponse.territories || '-'}
                              {dealOldResponse &&
                                dealRevisionNumber === deals.length - 1 &&
                                dealOldResponse.territories !==
                                  dealRevisionResponse.territories && (
                                  <ReactDiffViewer
                                    oldValue={dealOldResponse.territories}
                                    newValue={dealRevisionResponse.territories}
                                    splitView={false}
                                    disableWordDiff={true}
                                    hideLineNumbers={true}
                                  />
                                )}
                            </div>
                          </div>
                          <div className="p-2 border-2 lg:col-span-3 border-button">
                            5. {t('deal.term')}:
                          </div>
                          <div
                            className={
                              'border-2 lg:col-span-6 border-button bg-backgroundInput'
                            }
                          >
                            <div className="p-2">
                              {dealRevisionResponse.term || '-'}
                              {dealOldResponse &&
                                dealRevisionNumber === deals.length - 1 &&
                                dealOldResponse.term !==
                                  dealRevisionResponse.term && (
                                  <ReactDiffViewer
                                    oldValue={dealOldResponse.term}
                                    newValue={dealRevisionResponse.term}
                                    splitView={false}
                                    disableWordDiff={true}
                                    hideLineNumbers={true}
                                  />
                                )}
                            </div>
                          </div>
                          <div className="p-2 border-2 lg:col-span-3 border-button">
                            6. {t('deal.channels-of-distribution')}:
                          </div>
                          <div
                            className={
                              'border-2 lg:col-span-6 border-button bg-backgroundInput'
                            }
                          >
                            <div className="p-2">
                              {dealRevisionResponse.distribution_channels ||
                                '-'}
                              {dealOldResponse &&
                                dealRevisionNumber === deals.length - 1 &&
                                dealOldResponse.distribution_channels !==
                                  dealRevisionResponse.distribution_channels && (
                                  <ReactDiffViewer
                                    oldValue={
                                      dealOldResponse.distribution_channels
                                    }
                                    newValue={
                                      dealRevisionResponse.distribution_channels
                                    }
                                    splitView={false}
                                    disableWordDiff={true}
                                    hideLineNumbers={true}
                                  />
                                )}
                            </div>
                          </div>

                          <div className="p-2 border-2 lg:col-span-3 border-button">
                            7. {t('deal.date-of-distribution')}:
                          </div>

                          <div
                            className={
                              'border-2 lg:col-span-6 border-button bg-backgroundInput'
                            }
                          >
                            <div className="p-2">
                              {dealRevisionResponse.date_of_distribution || '-'}
                              {dealOldResponse &&
                                dealRevisionNumber === deals.length - 1 &&
                                dealOldResponse.date_of_distribution !==
                                  dealRevisionResponse.date_of_distribution && (
                                  <ReactDiffViewer
                                    oldValue={
                                      dealOldResponse.date_of_distribution
                                    }
                                    newValue={
                                      dealRevisionResponse.date_of_distribution
                                    }
                                    splitView={false}
                                    disableWordDiff={true}
                                    hideLineNumbers={true}
                                  />
                                )}
                            </div>
                          </div>

                          <div className="p-2 border-2 lg:col-span-3 border-button">
                            8. {t('deal.licensor-marketing-commitments')}:
                          </div>
                          <div
                            className={
                              'border-2 lg:col-span-6 border-button bg-backgroundInput'
                            }
                          >
                            <div className="p-2">
                              {dealRevisionResponse.licensor_marketing_commitment ||
                                '-'}
                            </div>
                          </div>

                          <div className="p-2 border-2 lg:col-span-3 border-button">
                            9. {t('deal.royalty-rate')}:
                          </div>
                          <div
                            className={
                              'border-2 lg:col-span-6 border-button bg-backgroundInput'
                            }
                          >
                            <div className="p-2">
                              {dealRevisionResponse.royalty_rate || '-'}
                              {dealOldResponse &&
                                dealRevisionNumber === deals.length - 1 &&
                                dealOldResponse.royalty_rate !==
                                  dealRevisionResponse.royalty_rate && (
                                  <ReactDiffViewer
                                    oldValue={dealOldResponse.royalty_rate}
                                    newValue={dealRevisionResponse.royalty_rate}
                                    splitView={false}
                                    disableWordDiff={true}
                                    hideLineNumbers={true}
                                  />
                                )}
                            </div>
                          </div>

                          <div className="p-2 border-2 lg:col-span-3 border-button">
                            10. {t('deal.guaranteed-minimum-royalty-payment')}:
                          </div>

                          <div
                            className={
                              'border-2 lg:col-span-6 border-button bg-backgroundInput'
                            }
                          >
                            <div className="p-2">
                              {dealRevisionResponse.guaranteed_minimum_royalty_payments ||
                                '-'}
                              {dealOldResponse &&
                                dealRevisionNumber === deals.length - 1 &&
                                dealOldResponse.guaranteed_minimum_royalty_payments !==
                                  dealRevisionResponse.guaranteed_minimum_royalty_payments && (
                                  <ReactDiffViewer
                                    oldValue={
                                      dealOldResponse.guaranteed_minimum_royalty_payments
                                    }
                                    newValue={
                                      dealRevisionResponse.guaranteed_minimum_royalty_payments
                                    }
                                    splitView={false}
                                    disableWordDiff={true}
                                    hideLineNumbers={true}
                                  />
                                )}
                            </div>
                          </div>

                          <div className="p-2 border-2 lg:col-span-3 border-button">
                            11. {t('deal.advance-payments')}:
                          </div>
                          <div
                            className={
                              'border-2 lg:col-span-6 border-button bg-backgroundInput'
                            }
                          >
                            <div className="p-2">
                              {dealRevisionResponse.advance_payments || '-'}
                              {dealOldResponse &&
                                dealRevisionNumber === deals.length - 1 &&
                                dealOldResponse.advance_payments !==
                                  dealRevisionResponse.advance_payments && (
                                  <ReactDiffViewer
                                    oldValue={dealOldResponse.advance_payments}
                                    newValue={
                                      dealRevisionResponse.advance_payments
                                    }
                                    splitView={false}
                                    disableWordDiff={true}
                                    hideLineNumbers={true}
                                  />
                                )}
                            </div>
                          </div>

                          <div className="p-2 border-2 lg:col-span-3 border-button">
                            12. {t('deal.payment-and-reporting')}:
                          </div>

                          <div
                            className={
                              'border-2 lg:col-span-6 border-button bg-backgroundInput'
                            }
                          >
                            <div className="p-2">
                              {dealRevisionResponse.payment_and_reporting ||
                                '-'}
                              {dealOldResponse &&
                                dealRevisionNumber === deals.length - 1 &&
                                dealOldResponse.payment_and_reporting !==
                                  dealRevisionResponse.payment_and_reporting && (
                                  <ReactDiffViewer
                                    oldValue={
                                      dealOldResponse.payment_and_reporting
                                    }
                                    newValue={
                                      dealRevisionResponse.payment_and_reporting
                                    }
                                    splitView={false}
                                    disableWordDiff={true}
                                    hideLineNumbers={true}
                                  />
                                )}
                            </div>
                          </div>

                          <div className="p-2 border-2 lg:col-span-3 border-button">
                            13. {t('deal.sample-requirements')}:
                          </div>

                          <div
                            className={
                              'border-2 lg:col-span-6 border-button bg-backgroundInput'
                            }
                          >
                            <div className="p-2">
                              {dealRevisionResponse.sample_requirements || '-'}
                              {dealOldResponse &&
                                dealRevisionNumber === deals.length - 1 &&
                                dealOldResponse.sample_requirements !==
                                  dealRevisionResponse.sample_requirements && (
                                  <ReactDiffViewer
                                    oldValue={
                                      dealOldResponse.sample_requirements
                                    }
                                    newValue={
                                      dealRevisionResponse.sample_requirements
                                    }
                                    splitView={false}
                                    disableWordDiff={true}
                                    hideLineNumbers={true}
                                  />
                                )}
                            </div>
                          </div>

                          <div className="p-2 border-2 lg:col-span-3 border-button">
                            14. {t('deal.sell-off-period')}:
                          </div>

                          <div
                            className={
                              'border-2 lg:col-span-6 border-button bg-backgroundInput'
                            }
                          >
                            <div className="p-2">
                              {dealRevisionResponse.sell_off_period || '-'}
                              {dealOldResponse &&
                                dealRevisionNumber === deals.length - 1 &&
                                dealOldResponse.sell_off_period !==
                                  dealRevisionResponse.sell_off_period && (
                                  <ReactDiffViewer
                                    oldValue={dealOldResponse.sell_off_period}
                                    newValue={
                                      dealRevisionResponse.sell_off_period
                                    }
                                    splitView={false}
                                    disableWordDiff={true}
                                    hideLineNumbers={true}
                                  />
                                )}
                            </div>
                          </div>

                          <div className="p-2 border-2 lg:col-span-3 border-button">
                            15. {t('deal.additional-provisions')}:
                          </div>

                          <div
                            className={
                              'border-2 lg:col-span-6 border-button bg-backgroundInput'
                            }
                          >
                            <div className="p-2">
                              {dealRevisionResponse.additional_provisions ||
                                '-'}
                              {dealOldResponse &&
                                dealRevisionNumber === deals.length - 1 &&
                                dealOldResponse.additional_provisions !==
                                  dealRevisionResponse.additional_provisions && (
                                  <ReactDiffViewer
                                    oldValue={
                                      dealOldResponse.additional_provisions
                                    }
                                    newValue={
                                      dealRevisionResponse.additional_provisions
                                    }
                                    splitView={false}
                                    disableWordDiff={true}
                                    hideLineNumbers={true}
                                  />
                                )}
                            </div>
                          </div>
                          {[...Array(numberOfExtraLines)].map(
                            (_: string, index: number) => {
                              return (
                                <Fragment key={index}>
                                  <div className="flex p-2 border-2 lg:col-span-3 border-button">
                                    <span className="pt-2">{index + 16}.</span>
                                    <span className="p-2">
                                      {extraContentKeys[index]}
                                    </span>
                                  </div>
                                  <div className="border-2 lg:col-span-6 border-button bg-backgroundInput">
                                    <div className="p-4">
                                      {extraContentValues[index]}
                                      {dealOldResponse &&
                                        dealRevisionNumber ===
                                          deals.length - 1 &&
                                        extraContentValuesOld[index] !==
                                          extraContentValues[index] && (
                                          <ReactDiffViewer
                                            oldValue={
                                              extraContentValuesOld[index]
                                            }
                                            newValue={extraContentValues[index]}
                                            splitView={false}
                                            disableWordDiff={true}
                                            hideLineNumbers={true}
                                          />
                                        )}
                                    </div>
                                  </div>
                                </Fragment>
                              );
                            }
                          )}
                        </div>
                        <InfoBox
                          text={t('deal.deal-memo-viewer-info')}
                          smaller
                        />
                      </div>
                    )}
                  </>
                ) : (
                  <CircleLoaderSpinner size={500} />
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
                  onClick={closeModal}
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

export default DealMemoViewer;
