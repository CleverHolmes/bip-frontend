import React, { useEffect, useState } from 'react';
import { MessageContentType, useChat } from '@chatscope/use-chat';
import { useTranslation } from 'next-i18next';
import dayjs from 'dayjs';
import { NextRouter, useRouter } from 'next/router';
import { useQueryClient } from '@tanstack/react-query';

import Icon from 'components/Icon';
import { MessageAttachmentAlternate } from 'models/messages/message';
import OwnImage from 'components/Image';
import useStore from 'modules/Store';
import DealMemoEditor from './components/DealMemoEditor';
import DealMemoViewer from 'components/Modals/DealMemoViewer';
import UploadAgreement from 'components/Modals/UploadAgreement';
import ConfirmAgreement from 'components/Modals/ConfirmAgreement';
import PlaceSignatureTabs from 'components/Modals/PlaceSignatureTabs';
import { findDealAttachmentsByUuid } from 'api/deal/findDealAttachmentsByUuid';
import {
  DealResponse,
  StatusEnum,
  ContractStatusEnum,
  DealAttachmentsResponse,
} from 'models/deals/deals';
import { retrieveDeals } from 'api/deal/retrieveDeals';
import { retrieveContractCall } from 'api/contract/retrieveContract';
import InfoRow from 'components/InfoRow';
import Button from 'components/Buttons/Button';
import DialogModal from 'components/DialogModal';
import FileGallery from 'components/FileGallery';
import ChatDetailsButton from 'components/ChatDetailsButton';
import AddPayments from 'components/Modals/AddPayments';
import AddPaymentSpecific from 'components/Modals/AddPaymentSpecific';
import { retrievePaymentScheduleCall } from 'api/contract/retrievePaymentSchedule';
import {
  PaymentScheduleDetails,
  RetrievePaymentScheduleResponse,
} from 'models/contract/payments';
import { ContractTabData } from 'models/contract/saveContractTabData';
import { getCurrentUuid } from 'utils/getCurrentUuid';
import { throwError } from 'utils/error';
import Modal from 'components/new/Modal';
import { removePaymentFomScheduleCall } from 'api/contract/removePaymentFromSchedule';
import { retrievePaymentSchedulesQueryKey } from 'api/contract/retrievePaymentSchedules';
import useTokensOrCookies from 'contexts/TokensOrCookies';

const ChatDetails = () => {
  const router: NextRouter = useRouter();
  const queryClient = useQueryClient();
  const userUUID = useStore((state) => state.userUUID);
  // const [viewMoreDealHistory, setViewMoreDealHistory] = useState(false);
  const [files, setFiles] = useState<MessageAttachmentAlternate[]>([]);
  const { currentMessages, activeConversation } = useChat();
  const [deals, setDeals] = useState<DealResponse[]>();

  const { companyRepresented } = useTokensOrCookies();
  const { t } = useTranslation();

  const [isOpen, setIsOpen] = useState(false);
  const [isOpenDeletePayment, setIsOpenDeletePayment] = useState(false);
  const [deleteUUID, setDeleteUUID] = useState<string>();
  const [isOpenPayments, setIsOpenPayments] = useState<boolean>(false);
  const [isOpenAddPayment, setIsOpenAddPayment] = useState<boolean>(false);
  const [isOpenFiles, setIsOpenFiles] = useState<boolean>(false);
  const [isOpenReviewer, setIsOpenReviewer] = useState<boolean>(false);
  const [isOpenUploadAgreement, setIsOpenUploadAgreement] =
    useState<boolean>(false);
  const [isOpenConfirmAgreement, setIsOpenConfirmAgreement] =
    useState<boolean>(false);
  const [isOpenPlaceSignatureTabs, setIsOpenPlaceSignatureTabs] =
    useState<boolean>(false);
  const [revisionNumber, setRevisionNumber] = useState<number>();
  const [refreshDeals, setRefreshDeals] = useState<boolean>(true);

  const [refreshPayment, setRefreshPayment] = useState<boolean>(true);
  const handleRefresh = () => {
    setRefreshPayment(true);
  };

  const [currentPaymentSchedule, setCurrentPaymentSchedule] =
    useState<RetrievePaymentScheduleResponse>();
  const [downloadingAgreement, setDownloadingAgreement] = useState(false);

  const senderUuid = getCurrentUuid();

  const mostRecentDeal = deals?.[deals?.length - 1] || null;

  const isAccepted = mostRecentDeal
    ? mostRecentDeal.status === StatusEnum.ACCEPTED
    : false;

  const isNotUploaded = mostRecentDeal
    ? mostRecentDeal.contract_status === ContractStatusEnum.NOT_UPLOADED
    : false;
  const isUploaded = mostRecentDeal
    ? mostRecentDeal.contract_status === ContractStatusEnum.UPLOADED
    : false;
  const isPartyAgreed = mostRecentDeal
    ? mostRecentDeal.contract_status === ContractStatusEnum.AGREED_PARTY
    : false;
  const isCounterpartyAgreed = mostRecentDeal
    ? mostRecentDeal.contract_status === ContractStatusEnum.AGREED_COUNTERPARTY
    : false;
  const isFullyAgreed = mostRecentDeal
    ? mostRecentDeal.contract_status === ContractStatusEnum.AGREED_BOTH_PARTIES
    : false;
  const isSignatureTabsPlaced = mostRecentDeal
    ? mostRecentDeal.contract_status ===
      ContractStatusEnum.SIGNATURE_TABS_PLACED
    : false;
  const isSentToDocusign = mostRecentDeal
    ? mostRecentDeal.contract_status === ContractStatusEnum.SENT_TO_DOCUSIGN
    : false;
  const isUserParty = mostRecentDeal
    ? mostRecentDeal.user_uuid === senderUuid
    : false;

  const allowToUploadAgreement =
    isNotUploaded || isUploaded || isPartyAgreed || isCounterpartyAgreed;
  const showFinishAgreementButton = isFullyAgreed || isSignatureTabsPlaced;
  const showAgreementAgreeButton =
    !isFullyAgreed &&
    !isSignatureTabsPlaced &&
    !isSentToDocusign &&
    ((isUserParty && !isPartyAgreed) ||
      (!isUserParty && !isCounterpartyAgreed));

  function closeModal() {
    setIsOpen(false);
  }

  function closeModalDeletePayment() {
    setIsOpenDeletePayment(false);
  }

  function closeModalPayments() {
    setIsOpenPayments(false);
  }

  function closeModalAddPayment() {
    setIsOpenAddPayment(false);
  }

  function closeModalFiles() {
    setIsOpenFiles(false);
  }

  function closeModalReviewer() {
    setIsOpenReviewer(false);
  }

  function closeModalUploadAgreement() {
    setIsOpenUploadAgreement(false);
  }

  function closeModalConfirmAgreement() {
    setIsOpenConfirmAgreement(false);
  }

  function closeModalPlaceSignatureTabs() {
    setIsOpenPlaceSignatureTabs(false);
  }

  function openModal() {
    setIsOpen(true);
  }
  function openModalDeletePayment(uuid: string) {
    setDeleteUUID(uuid);
    setIsOpenDeletePayment(true);
  }

  function openModalPayments() {
    setIsOpenPayments(true);
  }

  function openModalAddPayment() {
    setIsOpenAddPayment(true);
  }

  function openModalFiles() {
    setIsOpenFiles(true);
  }

  function openModalReviewer(revision: number) {
    setIsOpenReviewer(true);
    setRevisionNumber(revision);
  }

  function openModalUploadAgreement(
    event?: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    if (event) event.stopPropagation();
    if (allowToUploadAgreement) setIsOpenUploadAgreement(true);
  }

  function openModalConfirmAgreement() {
    setIsOpenConfirmAgreement(true);
  }

  function openModalPlaceSignatureTabs() {
    setIsOpenPlaceSignatureTabs(true);
  }

  useEffect(() => {
    let filesArray: any[] = [];
    currentMessages.forEach((group) => {
      group.messages.forEach((message) => {
        if (message.contentType === MessageContentType.Attachment) {
          filesArray.push(message.content.content);
        }
      });
    });
    setFiles(filesArray.reverse());
  }, [currentMessages]);

  useEffect(() => {
    if (!deals || !deals.length) return;
    retrievePaymentScheduleCall({
      dealUuid: deals[0].uuid,
      userUuid: companyRepresented ? companyRepresented : userUUID,
    })
      .then((res) => {
        setCurrentPaymentSchedule(res);
        setRefreshPayment(false);
      })
      .catch((err) => {
        throwError(err);
        setRefreshPayment(false);
      });
  }, [deals, companyRepresented, userUUID, activeConversation, refreshPayment]);

  const removePayment = () => {
    if (!currentPaymentSchedule) return;
    if (!deleteUUID) return;
    removePaymentFomScheduleCall({
      paymentScheduleUuid: deleteUUID,
      dealUuid: currentPaymentSchedule.dealUuid,
      userUuid: companyRepresented ? companyRepresented : userUUID,
    })
      .then(() => {
        setRefreshPayment(true);
        queryClient.invalidateQueries({
          queryKey: [retrievePaymentSchedulesQueryKey],
        });
        closeModalDeletePayment();
      })
      .catch((err) => {
        throwError(err);
      });
  };

  // const handleViewMoreDealHistory = () => {
  //   setViewMoreDealHistory(!viewMoreDealHistory);
  // };

  useEffect(() => {
    getDeals();
  }, [activeConversation, senderUuid, refreshDeals]);

  const getDeals = () => {
    if (senderUuid && activeConversation) {
      const body = {
        user_uuid: senderUuid,
        uuid: activeConversation.data.deal_uuid,
      };
      retrieveDeals(body)
        .then((res: DealResponse[]) => {
          const dealsSorted = res.sort((a, b) =>
            a.revision > b.revision ? 1 : -1
          );
          setDeals(dealsSorted);
          setRefreshDeals(false);
        })
        .catch((err) => throwError(err));
    }
  };

  const handleDownload = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.stopPropagation();

    if (activeConversation) {
      setDownloadingAgreement(true);
      try {
        const data = await retrieveContractCall({
          userUuid: senderUuid,
          dealUuid: activeConversation.data.deal_uuid,
        });

        location.href = `${data.uri}?download=1`;
      } finally {
        setDownloadingAgreement(false);
      }
    }
  };

  const handleAccept = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.stopPropagation();

    openModalConfirmAgreement();
  };

  const handleFinish = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.stopPropagation();

    openModalPlaceSignatureTabs();
  };

  const [filesDeal, setFilesDeal] = useState<DealAttachmentsResponse[]>();
  const [refreshImages, setRefreshImages] = useState<boolean>(true);

  useEffect(() => {
    if (
      (activeConversation?.data.deal_uuid && senderUuid && refreshImages) ||
      refreshDeals
    ) {
      const item = {
        user_uuid: senderUuid,
        deal_uuid: activeConversation?.data.deal_uuid,
      };
      findDealAttachmentsByUuid(item)
        .then((res) => {
          setFilesDeal(res);
          setRefreshImages(false);
        })
        .catch((err) => {
          throwError(err);
        });
    }
  }, [activeConversation?.data.deal_uuid, refreshDeals, refreshImages]);

  return (
    <div className="flex flex-col w-full h-full max-h-full p-4 overflow-auto md:w-3/12">
      {/* ONLY ON MOBILE */}
      <div className="fixed top-0 left-0 z-50 w-full md:hidden">
        <div className="flex items-center justify-center w-full px-5 py-4 bg-white border-b-2 md:hidden border-horizontalDivider">
          <div className="absolute left-5 top-4">
            <div
              className="flex flex-row items-center"
              onClick={() => router.push('/explore')}
            >
              <Icon
                name="Back"
                className="inline-block mt-1 cursor-pointer fill-button"
                viewBox="0 0 18 18"
                size="16"
              />
              <div className="text-base font-custom1 text-button">Explore</div>
            </div>
          </div>
          <div className="text-xl font-bold font-custom1">Deal Rooms</div>
        </div>
      </div>
      <div className="pb-40 mt-12 md:pb-0 md:mt-0">
        {deals && !!deals.length && (
          <ChatDetailsButton
            title={t('deal.listing-details')}
            showContentButton
            content={
              <>
                {deals?.[0]?.item.images && (
                  <div className="relative w-full">
                    <OwnImage
                      src={deals[0].item.image_logo}
                      alt={deals[0].item.name}
                      layout="fill"
                      classNameImage=" rounded-t-xl"
                    />
                  </div>
                )}
                <div className="flex flex-col mx-4 mt-8 sm:mx-6">
                  <div className="mb-10 text-xl font-bold font-custom1 text-primary">
                    {deals[0].item.name}
                  </div>

                  {deals[0].item.categories?.length > 0 &&
                    deals[0].item.categories.map((category: any) => {
                      const productArr = category.products.map((obj: any) => {
                        return obj.product_name;
                      });

                      return (
                        <InfoRow
                          key={category.category_name}
                          description={`${productArr.join(', ')}`}
                          title={`${category.category_name}`}
                        />
                      );
                    })}
                  {deals[0].item.distribution_channels?.length > 0 && (
                    <InfoRow
                      description={`${deals[0].item.distribution_channels.join(
                        ', '
                      )}`}
                      title={t('deal.distribution-channels')}
                      locked={deals[0].item.non_negotiable_terms.includes(
                        'distribution_channels'
                      )}
                    />
                  )}
                  {deals[0].item.territories?.length > 0 && (
                    <InfoRow
                      description={`${deals[0].item.territories.join(', ')}`}
                      title={t('deal.territories')}
                      locked={deals[0].item.non_negotiable_terms.includes(
                        'territories'
                      )}
                    />
                  )}
                  {deals[0].item.minimum_guarantee_percent && (
                    <InfoRow
                      description={`${deals[0].item.minimum_guarantee_percent}%`}
                      title={t('deal.min-guarantee-percent')}
                      locked={deals[0].item.non_negotiable_terms.includes(
                        'minimum_guarantee'
                      )}
                    />
                  )}
                  {deals[0].item.minimum_guarantee_amount && (
                    <InfoRow
                      description={`$${deals[0].item.minimum_guarantee_amount.toLocaleString(
                        'en-US',
                        { style: 'decimal', minimumFractionDigits: 0 }
                      )}`}
                      title={t('deal.min-guarantee-dollar')}
                      locked={deals[0].item.non_negotiable_terms.includes(
                        'minimum_guarantee'
                      )}
                    />
                  )}
                  {deals[0].item.royalty_percent && (
                    <InfoRow
                      description={`${deals[0].item.royalty_percent}%`}
                      title={t('deal.royalty-percent')}
                      locked={deals[0].item.non_negotiable_terms.includes(
                        'royalty_percent'
                      )}
                    />
                  )}
                  {deals[0].item.offer_deadline && (
                    <InfoRow
                      description={`${dayjs(
                        deals[0].item.offer_deadline
                      ).format('MMM DD, YYYY')}`}
                      title={t('deal.offer-deadline')}
                      locked={deals[0].item.non_negotiable_terms.includes(
                        'offer_deadline'
                      )}
                    />
                  )}
                  {deals[0].item.description && (
                    <InfoRow
                      description={deals[0].item.description}
                      title="description"
                      locked={deals[0].item.non_negotiable_terms.includes(
                        'description'
                      )}
                    />
                  )}
                </div>
              </>
            }
          />
        )}
        {deals && (
          <ChatDetailsButton
            active={isAccepted}
            title={
              isAccepted
                ? t('deal-memo-editor.accepted-deal')
                : t('deal-memo-editor.deal-memo-editor')
            }
            icon={{
              url: '/images/Vault/dealMemo.png',
              size: 40,
            }}
            onClick={openModal}
          />
        )}
        {isAccepted && (
          <ChatDetailsButton
            title={
              isNotUploaded
                ? t('deal.upload-an-agreement')
                : t('deal.uploaded-agreement')
            }
            active={!isNotUploaded}
            icon={{
              url: `/images/Vault/PDF.svg`,
              size: 48,
            }}
            showContentButton={!isNotUploaded}
            onClick={openModalUploadAgreement}
            content={
              <>
                <div className="mb-5 ml-2 text-sm">
                  {showAgreementAgreeButton &&
                    t('deal.download-and-review-agreement')}
                  {(isCounterpartyAgreed || isPartyAgreed) &&
                    !showAgreementAgreeButton &&
                    t('deal.agreement-agreed')}
                  {showFinishAgreementButton &&
                    t('deal.agreement-fully-agreed')}
                  {isSentToDocusign &&
                    t('deal.your-agreement-has-been-prepared')}
                </div>
                <div className="flex flex-col justify-end gap-3 overflow-hidden 2xl:flex-row">
                  <Button
                    smaller
                    color="yellow"
                    onClick={handleDownload}
                    disabled={downloadingAgreement}
                  >
                    {t('download')}
                  </Button>
                  {allowToUploadAgreement && (
                    <Button
                      smaller
                      color="yellow"
                      onClick={openModalUploadAgreement}
                    >
                      {t('upload')}
                    </Button>
                  )}
                  {showAgreementAgreeButton && (
                    <Button smaller onClick={handleAccept}>
                      {t('agree')}
                    </Button>
                  )}
                  {showFinishAgreementButton && (
                    <Button smaller onClick={handleFinish}>
                      {t('finish')}
                    </Button>
                  )}
                </div>
              </>
            }
          />
        )}
        {deals && deals.length > 1 && (
          <ChatDetailsButton
            title={t('chat.deal-memo-history')}
            showContentButton
            content={
              <>
                {deals.map((deal) => {
                  return (
                    <div
                      className={
                        'flex pl-4 pr-4 flex-row items-center hover:bg-backgroundInput hover:rounded-2xl cursor-pointer'
                      }
                      key={deal.revision}
                      onClick={(event) => {
                        event.stopPropagation();
                        openModalReviewer(deal.revision);
                      }}
                    >
                      <div
                        className={`ml-2 text-base font-bold font-custom1 text-primary my-2`}
                      >
                        {t('chat.deal-revision')}: {deal.revision + 1}{' '}
                        {deal.revision === 0
                          ? '- Original'
                          : deal.revision === deals.length - 1
                          ? '- Current'
                          : ''}
                      </div>
                    </div>
                  );
                })}
              </>
            }
          />
        )}
        {deals &&
          deals.length >= 1 &&
          (deals[deals.length - 1].contract_status === 'agreed_both_parties' ||
            deals[deals.length - 1].contract_status ===
              'signature_tabs_placed' ||
            deals[deals.length - 1].contract_status === 'sent_to_docusign') && (
            <ChatDetailsButton
              extraButtonOption1={t('edit-royalty-payment-schedule')}
              extraButtonOption2={t('add-important-date')}
              glowColor="redButton"
              title={t('chat.payment-schedule')}
              onClick={openModalPayments}
              onClick2={openModalAddPayment}
              showContentButton={currentPaymentSchedule ? true : false}
              onClickJustToggle={true}
              content={
                <>
                  {currentPaymentSchedule?.paymentScheduleDetails.map(
                    (item: PaymentScheduleDetails, index: number) => {
                      return (
                        <div
                          className={
                            'flex pl-4 pr-4 flex-row items-start hover:bg-backgroundInput hover:rounded-2xl cursor-pointer relative'
                          }
                          key={item.uuid}
                        >
                          <div
                            className={`ml-2 text-base font-bold font-custom1 text-primary my-2 w-[80px] min-w-[80px] text-wrap`}
                          >
                            {dayjs(item.date).format('MMM DD, YYYY')}
                          </div>
                          <div className="my-2 ml-2 text-sm font-custom1 text-primary">
                            {
                              currentPaymentSchedule.paymentScheduleDetails[
                                index
                              ].description
                            }
                          </div>
                          <Icon
                            name="Minus"
                            className="absolute right-0 ml-2 stroke-redButton top-5"
                            viewBox="0 0 18 18"
                            size="12"
                            onClick={() =>
                              openModalDeletePayment(
                                currentPaymentSchedule.paymentScheduleDetails[
                                  index
                                ].uuid
                              )
                            }
                          />
                        </div>
                      );
                    }
                  )}
                </>
              }
            />
          )}

        <ChatDetailsButton
          title="Attached Files"
          subTitle={`${files.length} files`}
          onClick={openModalFiles}
        />
        {activeConversation?.data.deal_uuid && filesDeal && deals && (
          <Modal
            isOpen={isOpen}
            title={
              mostRecentDeal?.status === 'Accepted'
                ? t('deal-memo-editor.accepted-deal')
                : t('deal-memo-editor.deal-memo')
            }
            closeModal={closeModal}
          >
            <DealMemoEditor
              dealID={activeConversation?.data.deal_uuid}
              refreshDeals={refreshDeals}
              setRefreshDeals={setRefreshDeals}
              files={filesDeal}
              setRefreshImages={setRefreshImages}
              mostRecentDeal={deals[deals.length - 1]}
            />
          </Modal>
        )}
        {deals && filesDeal && (
          <DealMemoViewer
            isOpen={isOpenReviewer}
            closeModal={closeModalReviewer}
            dealID={activeConversation?.data.deal_uuid}
            revisionNumber={revisionNumber || 0}
            deals={deals.sort((a, b) => (a.revision > b.revision ? 1 : -1))}
            files={filesDeal}
          />
        )}
        <UploadAgreement
          isOpen={isOpenUploadAgreement}
          closeModal={closeModalUploadAgreement}
          dealUuid={activeConversation?.data.deal_uuid}
          userUuid={senderUuid}
          onUpload={getDeals}
          showExtraText={isCounterpartyAgreed || isPartyAgreed}
        />
        <ConfirmAgreement
          isOpen={isOpenConfirmAgreement}
          closeModal={closeModalConfirmAgreement}
          dealUuid={activeConversation?.data.deal_uuid}
          userUuid={senderUuid}
          onSend={getDeals}
        />
        <PlaceSignatureTabs
          isOpen={isOpenPlaceSignatureTabs}
          closeModal={closeModalPlaceSignatureTabs}
          dealUuid={activeConversation?.data.deal_uuid}
          userUuid={senderUuid}
          onSendAgreement={getDeals}
          baseTabPosition={
            mostRecentDeal?.contract_tab_data as ContractTabData[] | undefined
          }
          partySignerName={mostRecentDeal?.contract_user_signer_name}
          counterpartySignerName={
            mostRecentDeal?.contract_counterparty_signer_name
          }
        />
        <DialogModal
          closeModal={closeModalFiles}
          isOpen={isOpenFiles}
          dialogTitle={t('chat.attached-files')}
        >
          <div className="mt-10">
            <FileGallery files={files} />
          </div>
        </DialogModal>
        {deals &&
          deals.length >= 1 &&
          (deals[deals.length - 1].contract_status === 'agreed_both_parties' ||
            deals[deals.length - 1].contract_status ===
              'signature_tabs_placed' ||
            deals[deals.length - 1].contract_status === 'sent_to_docusign') && (
            <DialogModal
              closeModal={closeModalPayments}
              isOpen={isOpenPayments}
              dialogTitle={t('chat.payment-schedule')}
            >
              <div className="mt-10">
                {mostRecentDeal && (
                  <AddPayments
                    deal={deals[deals.length - 1].uuid}
                    currentPaymentSchedule={currentPaymentSchedule}
                    handleRefresh={handleRefresh}
                  />
                )}
              </div>
            </DialogModal>
          )}
        {deals &&
          deals.length >= 1 &&
          (deals[deals.length - 1].contract_status === 'agreed_both_parties' ||
            deals[deals.length - 1].contract_status ===
              'signature_tabs_placed' ||
            deals[deals.length - 1].contract_status === 'sent_to_docusign') && (
            <DialogModal
              closeModal={closeModalAddPayment}
              isOpen={isOpenAddPayment}
              dialogTitle={t('add-important-date')}
            >
              <div className="mt-10">
                {mostRecentDeal && (
                  <AddPaymentSpecific
                    deal={deals[deals.length - 1].uuid}
                    handleRefresh={handleRefresh}
                  />
                )}
              </div>
            </DialogModal>
          )}
        <DialogModal
          closeModal={closeModalDeletePayment}
          isOpen={isOpenDeletePayment}
          dialogTitle={t('chat.remove-payment-title')}
        >
          <div className="px-4 py-2 my-10 mr-5 text-lg text-primary font-custom1">
            {t('chat.remove-payment-text')}
          </div>
          <Button onClick={removePayment}>{t('delete')}</Button>
        </DialogModal>
      </div>
    </div>
  );
};

export default ChatDetails;
