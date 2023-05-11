import dayjs from 'dayjs';
import { NextRouter, useRouter } from 'next/router';
import React, { useEffect, useState, Fragment } from 'react';
import { useChat } from '@chatscope/use-chat';
import { useTranslation } from 'next-i18next';
import { toast } from 'react-toastify';

import { ModalDismissAsyncButton } from 'components/ModalWindow';
import { getConversation } from 'api/messages/getConversation';
import { findDealAttachmentsByUuid } from 'api/deal/findDealAttachmentsByUuid';
import { rejectProposal } from 'api/deal/rejectProposal';
import { DealAttachmentsResponse, DealResponse } from 'models/deals/deals';
import UploadedFileSmaller from 'components/UploadedFileSmaller';
import Button from 'components/Buttons/Button';
import { convertedImageLogo } from 'public/helpers/convertedImageLogo';
import { deleteDraft } from 'api/deal/deleteDraft';
import Toast from 'components/Toast';
import DialogModal from 'components/DialogModal';
import { sendConversation } from 'api/messages/sendConversation';
import routes from 'constants/routes';
import { throwError } from 'utils/error';
import useStore from 'modules/Store';
import { getCurrentUuid } from 'utils/getCurrentUuid';
import useTokensOrCookies from 'contexts/TokensOrCookies';

interface Props {
  deal: DealResponse;
  dealStatus: string;
  userUUID: string;
  refreshDeal: () => void;
}

const DealModal: React.FC<Props> = ({
  deal,
  dealStatus,
  userUUID,
  refreshDeal,
}) => {
  const [error, setError] = useState<string>('');
  const { t } = useTranslation();
  const { companyRepresented } = useTokensOrCookies();
  const [files, setFiles] = useState<DealAttachmentsResponse[]>();
  const router: NextRouter = useRouter();
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const { conversations } = useChat();
  const addParticipants = useStore((state) => state.addParticipants);
  const addConversations = useStore((state) => state.addConversations);

  useEffect(() => {
    if (deal.uuid && userUUID) {
      const item = {
        user_uuid: companyRepresented ? companyRepresented : userUUID,
        deal_uuid: deal.uuid,
      };
      findDealAttachmentsByUuid(item)
        .then((res) => {
          setFiles(res);
        })
        .catch((err) => {
          throwError(err);
        });
    }
  }, [deal.uuid, userUUID, companyRepresented]);

  const RejectProposal = () => {
    setIsDisabled(true);
    const item = {
      uuid: deal.uuid,
      user_uuid: companyRepresented ? companyRepresented : userUUID,
    };
    return rejectProposal(item)
      .then((res) => {
        refreshDeal();
        setIsDisabled(false);
        return res;
      })
      .catch((err) => {
        setError(JSON.parse(err.request.response).message);
        setIsDisabled(false);
        refreshDeal();
      });
  };

  const GoToDealRoom = () => {
    setIsDisabled(true);
    const conversation = {
      conversation_name: deal.deal_name,
      user_uuid: companyRepresented ? companyRepresented : userUUID,
      deal_uuid: deal.uuid,
      participant_uuids: [deal.user_uuid, deal.counterparty_user_uuid],
    };
    return sendConversation(conversation)
      .then(async (data) => {
        const conversationId = data.uuid;
        await populateConversations();

        if (conversationId) {
          router.push(
            routes.chatConversation,
            `${routes.chat}/${conversationId}`
          );
        } else {
          router.push(routes.chat);
        }
      })
      .catch((err) => {
        setError(JSON.parse(err.request.response).message);
        setIsDisabled(false);
        refreshDeal();
      });
  };

  const populateConversations = async () => {
    const data = await getConversation({
      userUuid: getCurrentUuid(),
    });
    addParticipants(data.participants);
    addConversations(data.messageConversations);
  };

  const ViewDraft = () => {
    router.push(
      `/deal-proposal/${deal.item.uuid}?draft=${deal.uuid}&revise=true`
    );
    return new Promise((resolve, reject) => {
      resolve(201);
    });
  };

  const DeleteDraft = async () => {
    const item = {
      data: {
        user_uuid: companyRepresented ? companyRepresented : userUUID,
        deal_uuids: [deal.uuid],
      },
    };
    try {
      await deleteDraft(item);
      refreshDeal();
      toast(<Toast message={t('deal.your-draft-has-been-deleted')} />);
    } catch (err) {
      throwError(err);
    }
  };

  const GoToChat = () => {
    const conversationId = deal.message_conversation_uuid;
    if (conversationId) {
      router.push(routes.chatConversation, `${routes.chat}/${conversationId}`);
    } else {
      router.push(routes.chat);
    }
    setIsDisabled(true);

    return new Promise((resolve, reject) => {
      setIsDisabled(false);
      resolve(201);
    });
  };

  const [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  return (
    <>
      <div className="px-5 md:px-10 lg:px-20">
        <div className="mb-2 text-3xl font-bold font-custom1">
          {deal.deal_name}
        </div>
        {deal && deal.description && (
          <>
            <div className="mt-10 mb-4 text-xl font-bold font-custom1 lg:text-3xl text-primary">
              {t('deal.description')}:
            </div>
            <div className="mb-6 text-base font-custom1 text-blueText">
              {deal.description}
            </div>
          </>
        )}
        {files && files.length > 0 && (
          <>
            <div className="mt-10 mb-4 text-xl font-bold font-custom1 lg:text-3xl text-primary">
              {t('deal.files')}:
            </div>
            <div className="mb-6 text-base font-custom1 text-blueText">
              <div className="flex flex-wrap">
                {files &&
                  files.map((item) => {
                    let image = convertedImageLogo(item.uri);
                    return (
                      <UploadedFileSmaller
                        image={image}
                        title={item.filename_original}
                        key={item.uri}
                        uri={item.uri}
                        deleteCapable={true}
                      />
                    );
                  })}
              </div>
            </div>
          </>
        )}
        <div className="mt-10 mb-6 text-xl font-bold font-custom1 lg:text-3xl text-primary lg:mb-8">
          {t('deal.deal-specifics')}
        </div>
        {deal && (
          <div className="mt-6 font-bold border-4 lg:grid lg:grid-cols-3 border-button">
            <div className="p-2 border-2 lg:col-span-1 border-button text-blueText">
              {t('date')}:
            </div>
            <div className="border-2 lg:col-span-2 border-button bg-backgroundInput">
              <div className="p-4">
                <span className="text-base font-custom1 text-blueText">
                  {dayjs(new Date(deal.created_at)).format('MMM DD, YYYY')}
                </span>
              </div>
            </div>
            <div className="p-2 border-2 lg:col-span-1 border-button text-blueText">
              {t('deal.party')} 1:
            </div>
            <div className="border-2 lg:col-span-2 border-button bg-backgroundInput text-blueText">
              <div className="p-4 text-base font-custom1 text-blueText">
                {deal.user.company_name}
              </div>
            </div>
            <div className="p-2 border-2 lg:col-span-1 border-button text-blueText">
              {t('deal.party')} 2:
            </div>
            <div className="border-2 lg:col-span-2 border-button bg-backgroundInput text-blueText">
              <div className="p-4 text-base font-custom1 text-blueText">
                {deal.counterparty.company_name}
              </div>
            </div>
            {deal.deal_type === 'Collaboration' && (
              <>
                <div className="p-2 border-2 lg:col-span-1 border-button text-blueText">
                  {t('deal.collaboration-brand')}:
                </div>
                <div className="border-2 lg:col-span-2 border-button bg-backgroundInput text-blueText">
                  <div className="p-4 text-base font-custom1 text-blueText">
                    {deal.collaboration_item.name}
                  </div>
                </div>
              </>
            )}

            <div className="p-2 border-2 border-r-2 lg:col-span-1 border-button text-blueText">
              1. {t('listing')}:
            </div>
            <div className="border-2 lg:col-span-2 border-button bg-backgroundInput">
              <div className="p-4 text-base font-custom1 text-blueText">
                {deal.property || '-'}
              </div>
            </div>
            <div className="p-2 border-2 lg:col-span-1 border-button text-blueText">
              2. {t('deal.exclusive')}:
            </div>
            <div className="border-2 lg:col-span-2 border-button bg-backgroundInput">
              <div className="p-4 text-base font-custom1 text-blueText">
                {deal.exclusive || '-'}
              </div>
            </div>
            <div className="p-2 border-2 lg:col-span-1 border-button text-blueText">
              3. {t('product-categories')}:
            </div>
            <div className="border-2 lg:col-span-2 border-button bg-backgroundInput">
              <div className="p-4 text-base font-custom1 text-blueText">
                {deal.categories || '-'}
              </div>
            </div>
            <div className="p-2 border-2 lg:col-span-1 border-button text-blueText">
              4. {t('deal.territory')}:
            </div>
            <div className="border-2 lg:col-span-2 border-button bg-backgroundInput">
              <div className="p-4 text-base font-custom1 text-blueText">
                {deal.territories || '-'}
              </div>
            </div>
            <div className="p-2 border-2 lg:col-span-1 border-button text-blueText">
              5. {t('deal.term')}:
            </div>
            <div className="border-2 lg:col-span-2 border-button bg-backgroundInput">
              <div className="p-4 text-base font-custom1 text-blueText">
                {deal.term || '-'}
              </div>
            </div>
            <div className="p-2 border-2 lg:col-span-1 border-button text-blueText">
              6. {t('deal.channels-of-distribution')}:
            </div>
            <div className="border-2 lg:col-span-2 border-button bg-backgroundInput">
              <div className="p-4 text-base font-custom1 text-blueText">
                {deal.distribution_channels || '-'}
              </div>
            </div>
            <div className="p-2 border-2 lg:col-span-1 border-button text-blueText">
              7. {t('deal.date-of-distribution')}:
            </div>
            <div className="border-2 lg:col-span-2 border-button bg-backgroundInput">
              <div className="p-4 text-base font-custom1 text-blueText">
                {deal.date_of_distribution || '-'}
              </div>
            </div>
            <div className="p-2 border-2 lg:col-span-1 border-button text-blueText">
              8. {t('deal.licensor-marketing-commitments')}:
            </div>
            <div className="border-2 lg:col-span-2 border-button bg-backgroundInput">
              <div className="p-4 text-base font-custom1 text-blueText">
                {deal.licensor_marketing_commitment || '-'}
              </div>
            </div>
            <div className="p-2 border-2 lg:col-span-1 border-button text-blueText">
              9. {t('deal.royalty-rate')}:
            </div>
            <div className="border-2 lg:col-span-2 border-button bg-backgroundInput">
              <div className="p-4 text-base font-custom1 text-blueText">
                {deal.royalty_rate || '-'}
              </div>
            </div>
            <div className="p-2 border-2 lg:col-span-1 border-button text-blueText">
              10. {t('deal.guaranteed-minimum-royalty-payment')}:
            </div>
            <div className="border-2 lg:col-span-2 border-button bg-backgroundInput">
              <div className="p-4 text-base font-custom1 text-blueText">
                {deal.guaranteed_minimum_royalty_payments || '-'}
              </div>
            </div>
            <div className="p-2 border-2 lg:col-span-1 border-button text-blueText">
              11. {t('deal.advance-payments')}:
            </div>
            <div className="border-2 lg:col-span-2 border-button bg-backgroundInput">
              <div className="p-4 text-base font-custom1 text-blueText">
                {deal.advance_payments || '-'}
              </div>
            </div>
            <div className="p-2 border-2 lg:col-span-1 border-button text-blueText">
              12. {t('deal.payment-and-reporting')}:
            </div>
            <div className="border-2 lg:col-span-2 border-button bg-backgroundInput">
              <div className="p-4 text-base font-custom1 text-blueText">
                {deal.payment_and_reporting || '-'}
              </div>
            </div>
            <div className="p-2 border-2 lg:col-span-1 border-button text-blueText">
              13. {t('deal.sample-requirements')}:
            </div>
            <div className="border-2 lg:col-span-2 border-button bg-backgroundInput">
              <div className="p-4 text-base font-custom1 text-blueText">
                {deal.sample_requirements || '-'}
              </div>
            </div>
            <div className="p-2 border-2 lg:col-span-1 border-button text-blueText">
              14. {t('deal.sell-off-period')}:
            </div>
            <div className="border-2 lg:col-span-2 border-button bg-backgroundInput">
              <div className="p-4 text-base font-custom1 text-primary text-blueText">
                {deal.sell_off_period || '-'}
              </div>
            </div>
            <div className="p-2 border-2 text-blueText lg:col-span-1 border-button">
              15. {t('deal.additional-provisions')}:
            </div>
            <div className="border-2 lg:col-span-2 border-button bg-backgroundInput">
              <div className="p-4 text-base font-custom1 text-blueText">
                {deal.additional_provisions || '-'}
              </div>
            </div>

            {deal.custom_fields.map(
              (field: { [key: string]: string }, index: number) => {
                return (
                  <Fragment key={index}>
                    <div className="flex p-2 border-2 lg:col-span-1 border-button text-blueText">
                      {`${index + 16}. ${field.fieldName}`}
                    </div>
                    <div className="border-2 lg:col-span-2 border-button bg-backgroundInput">
                      <div className="p-4 text-base font-custom1 text-blueText">
                        {field.fieldValue || '-'}
                      </div>
                    </div>
                  </Fragment>
                );
              }
            )}
          </div>
        )}
      </div>
      <div
        className="flex items-center max-w-2xl px-4 py-3 mx-5 my-10 text-sm font-bold text-white rounded-lg lg:mx-auto bg-button font-custom2"
        role="alert"
      >
        <svg
          className="w-4 h-4 mr-4 fill-current"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path d="M12.432 0c1.34 0 2.01.912 2.01 1.957 0 1.305-1.164 2.512-2.679 2.512-1.269 0-2.009-.75-1.974-1.99C9.789 1.436 10.67 0 12.432 0zM8.309 20c-1.058 0-1.833-.652-1.093-3.524l1.214-5.092c.211-.814.246-1.141 0-1.141-.317 0-1.689.562-2.502 1.117l-.528-.88c2.572-2.186 5.531-3.467 6.801-3.467 1.057 0 1.233 1.273.705 3.23l-1.391 5.352c-.246.945-.141 1.271.106 1.271.317 0 1.357-.392 2.379-1.207l.6.814C12.098 19.02 9.365 20 8.309 20z" />
        </svg>
        <p>
          {t('onboarding.advancing-proposal-moves-to-deal-room')}
          <br />
          {t('onboarding.this-does-not-automatically-accept-the-deal')}.
        </p>
      </div>
      <div className="h-4 ml-4 text-sm text-red-400 font-custom2">
        {error && error}
      </div>
      {dealStatus.toLowerCase() === 'proposed' &&
        (deal.current_user_uuid === userUUID ||
          deal.current_user_uuid === companyRepresented) && (
          <div className="!z-50  sticky bottom-0 left-0  w-full  !bg-white !border-t-2 border-borderColor rounded-t-xl drop-shadow-[0_35px_35px_rgba(0,0,0,0.25)] h-48 sm:h-24">
            <div className="flex flex-row items-center justify-end">
              {deal.user_uuid === userUUID ||
              deal.user_uuid === companyRepresented ? (
                <div className="mt-4 mr-4">
                  <Button disabled={isDisabled} onClick={GoToChat}>
                    {t('onboarding.go-to-chat')}
                  </Button>
                </div>
              ) : conversations?.filter(
                  (item) => item.data.deal_uuid === deal.uuid
                ).length === 0 ? (
                <div className="flex flex-col items-center justify-end mr-5 sm:flex-row sm:mr-0">
                  <div className="mt-4">
                    <Button
                      disabled={isDisabled}
                      onClick={() => {
                        openModal();
                      }}
                      color="yellow"
                    >
                      {t('onboarding.reject')}
                    </Button>
                  </div>
                  <div className="mt-4 sm:mx-5">
                    <ModalDismissAsyncButton>
                      <Button onClick={GoToDealRoom}>Go to Deal Room</Button>
                    </ModalDismissAsyncButton>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-end mr-5 sm:flex-row sm:mr-0">
                  <div className="mt-4 mr-4">
                    <ModalDismissAsyncButton>
                      <Button disabled={isDisabled} onClick={GoToChat}>
                        {t('onboarding.go-to-chat')}
                      </Button>
                    </ModalDismissAsyncButton>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      {dealStatus.toLowerCase() === 'draft' && (
        <div className="!z-50  sticky bottom-0 left-0  w-full  !bg-white !border-t-2 border-borderColor rounded-t-xl drop-shadow-[0_35px_35px_rgba(0,0,0,0.25)] h-48 sm:h-24">
          <div className="flex flex-col items-center justify-end md:flex-row">
            <div className="mt-4 mr-4">
              <Button color="yellow" onClick={DeleteDraft}>
                {t('onboarding.delete-draft')}
              </Button>
            </div>
            <div className="mt-4 mr-4">
              <ModalDismissAsyncButton>
                <Button onClick={ViewDraft}>
                  {t('onboarding.view-draft')}
                </Button>
              </ModalDismissAsyncButton>
            </div>
          </div>
        </div>
      )}
      {dealStatus.toLowerCase() === 'accepted' && (
        <div className="!z-50  sticky bottom-0 left-0  w-full  !bg-white !border-t-2 border-borderColor rounded-t-xl drop-shadow-[0_35px_35px_rgba(0,0,0,0.25)] h-48 sm:h-24">
          <div className="flex flex-row items-center justify-end">
            <div className="mt-4 mr-4">
              <ModalDismissAsyncButton>
                <Button onClick={GoToChat}>{t('onboarding.go-to-chat')}</Button>
              </ModalDismissAsyncButton>
            </div>
          </div>
        </div>
      )}
      <DialogModal
        closeModal={closeModal}
        isOpen={isOpen}
        dialogTitle={t('settings.reject-deal')}
      >
        <div className="py-10 mx-auto text-lg font-custom1 font-primary">
          {t('settings.reject-deal-text')}
        </div>
        <ModalDismissAsyncButton>
          <Button
            onClick={() => {
              RejectProposal();
              closeModal();
              return new Promise((resolve, reject) => {
                resolve(201);
              });
            }}
          >
            {t('onboarding.reject')}
          </Button>
        </ModalDismissAsyncButton>
      </DialogModal>
    </>
  );
};

export default DealModal;
