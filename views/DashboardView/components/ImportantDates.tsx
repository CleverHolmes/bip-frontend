import React, { useState } from 'react';
import dayjs from 'dayjs';
import classnames from 'classnames';
import { useTranslation } from 'next-i18next';
import relativeTIme from 'dayjs/plugin/relativeTime';
import { useQuery } from '@tanstack/react-query';

import Icon from 'components/Icon';
import { PaymentSchedulesResponse } from 'models/contract/payments';
import DialogModal from 'components/DialogModal';
import Button from 'components/Buttons/Button';
import AddPaymentSpecific from 'components/Modals/AddPaymentSpecific';
import AddPayments from 'components/Modals/AddPayments';
import AddPaymentAllTypes from 'components/Modals/AddPaymentAllTypes';
import { removePaymentFomScheduleCall } from 'api/contract/removePaymentFromSchedule';
import { throwError } from 'utils/error';
import {
  retrievePaymentSchedulesCall,
  retrievePaymentSchedulesQueryKey,
} from 'api/contract/retrievePaymentSchedules';
import useStore from 'modules/Store';

const ImportantDates: React.FC = () => {
  dayjs.extend(relativeTIme);
  const { t } = useTranslation();

  const [isOpenDeletePayment, setIsOpenDeletePayment] =
    useState<boolean>(false);
  const [isOpenAddPayment, setIsOpenAddPayment] = useState<boolean>(false);
  const [isOpenPayment, setIsOpenPayment] = useState<boolean>(false);
  const [isOpenGeneralPayment, setIsOpenGeneralPayment] =
    useState<boolean>(false);
  const [updateUUID, setUpdateUUID] = useState<string>();
  const [deleteDealUUID, setDeleteDealUUID] = useState<string>();

  const userUuid = useStore((state) => state.userUUID);

  const { data: paymentSchedule, refetch } = useQuery({
    queryKey: [retrievePaymentSchedulesQueryKey],
    queryFn: async () => {
      return await retrievePaymentSchedulesCall({ userUuid });
    },
    enabled: !!userUuid,
    onError: (err) => {
      throwError(err);
    },
  });

  function openModalDeletePayment(uuid: string, dealUuid: string) {
    setUpdateUUID(dealUuid);
    setDeleteDealUUID(uuid);
    setIsOpenDeletePayment(true);
  }

  function closeModalDeletePayment() {
    setIsOpenDeletePayment(false);
  }

  function closeModalAddPayment() {
    setIsOpenAddPayment(false);
  }
  function closeModalGeneralPayment() {
    setIsOpenGeneralPayment(false);
  }
  function closeModalPayment() {
    setIsOpenPayment(false);
  }

  function showModalSpecificPayment(dealUUID: string) {
    setUpdateUUID(dealUUID);
  }

  function openModalAddPayment(dealUUID: string) {
    setIsOpenAddPayment(true);
    setUpdateUUID(dealUUID);
  }
  function openModalPayment() {
    setIsOpenPayment(true);
  }

  function openModalGeneralPayment(dealUUID: string) {
    setIsOpenGeneralPayment(true);
    setUpdateUUID(dealUUID);
  }

  const removePayment = () => {
    if (!deleteDealUUID) return;
    if (!updateUUID) return;
    removePaymentFomScheduleCall({
      paymentScheduleUuid: deleteDealUUID,
      dealUuid: updateUUID,
      userUuid,
    })
      .then(() => {
        refetch();
        closeModalDeletePayment();
      })
      .catch((err) => {
        throwError(err);
      });
  };

  const handleRefresh = () => {
    refetch();
  };

  return (
    <>
      <div className="flex flex-col">
        <div className="flex items-center">
          <div className="mb-2 text-lg font-bold font-custom1 lg:text-xl text-primary lg:mb-4">
            {t('add-important-date')}
          </div>
          <Icon
            name="Plus"
            className={classnames('mb-4 ml-2 cursor-pointer stroke-green')}
            viewBox="0 0 18 18"
            size="12"
            onClick={openModalPayment}
          />
        </div>
        <div className="flex flex-col items-start gap-4 lg:flex-row">
          <div
            className={classnames(
              'overflow-x-auto max-h-[40rem] bg-backgroundInput rounded-lg drop-shadow-lg w-full px-4 py-4',
              { 'lg:w-1/2': !!updateUUID }
            )}
          >
            <div className="flex flex-col leading-normal">
              <div className="flex flex-col items-start text-base font-custom2 p-2 -m-1  rounded-lg  text-inputGray  px-3 2xl:px-3.5 my-1 border-2 border-backgroundInput bg-white">
                {!!paymentSchedule &&
                  paymentSchedule.length > 0 &&
                  paymentSchedule.map((item: PaymentSchedulesResponse) => {
                    return (
                      <div className="flex flex-col mt-2" key={item.dealUuid}>
                        <div className="flex items-center">
                          <div
                            className="mb-2 text-lg font-bold cursor-pointer font-custom1 text-primary hover:bg-backgroundInput"
                            onClick={() =>
                              showModalSpecificPayment(item.dealUuid)
                            }
                          >
                            {item.dealName}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                {!!paymentSchedule && paymentSchedule.length === 0 && (
                  <div className="flex flex-col mt-2">
                    <div className="py-8 text-lg font-normal text-left text-inputGray font-custom1">
                      {t('dashboard.no-dates')}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          {updateUUID && (
            <div
              className={classnames(
                'overflow-x-auto bg-backgroundInput rounded-lg drop-shadow-lg lg:w-1/2 w-full px-4 py-4'
              )}
            >
              <div className="flex flex-col leading-normal">
                <div className="flex flex-col items-start min-h-[9rem] text-base font-custom2 p-2 -m-1 rounded-lg text-inputGray px-3 2xl:px-3.5 my-1 border-2 border-backgroundInput bg-white">
                  {!!paymentSchedule &&
                    paymentSchedule.length > 0 &&
                    paymentSchedule
                      .filter((item) => item.dealUuid === updateUUID)
                      .map((item: PaymentSchedulesResponse) => {
                        return (
                          <div
                            className="flex flex-col mt-2 min-h-[100px] w-full"
                            key={item.dealUuid}
                          >
                            <div className="flex items-center">
                              <div
                                className="mb-2 text-lg font-bold font-custom1 text-primary hover:bg-backgroundInput"
                                onClick={() =>
                                  showModalSpecificPayment(item.dealUuid)
                                }
                              >
                                {item.dealName}
                              </div>

                              <div className="flex items-center justify-center w-8 h-8 mb-2 bg-white rounded-lg">
                                <div className="relative inline-block w-full h-full group">
                                  <Icon
                                    name="Plus"
                                    className="h-full mx-auto my-auto cursor-pointer stroke-green"
                                    viewBox="0 0 18 18"
                                    size="12"
                                  />
                                  <div className="absolute z-20 hidden w-64 text-base rounded-lg shadow-lg -left-40 top-8 sm:right-auto font-custom1 text-primary group-hover:block group-hover:bg-white">
                                    <div
                                      className="flex w-full px-8 py-3 rounded-t-lg cursor-pointer hover:bg-backgroundInput"
                                      onClick={() =>
                                        openModalGeneralPayment(item.dealUuid)
                                      }
                                    >
                                      {t('edit-royalty-payment-schedule')}
                                    </div>

                                    <div
                                      className="flex w-full px-8 py-3 rounded-b-lg cursor-pointer hover:bg-backgroundInput"
                                      onClick={() =>
                                        openModalAddPayment(item.dealUuid)
                                      }
                                    >
                                      {t('add-important-date')}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <table className="w-full">
                              <tbody>
                                {item.paymentScheduleDetails.map((payment) => {
                                  return (
                                    <tr key={payment.uuid}>
                                      <td className="pr-2 align-top whitespace-nowrap w-[100px]">
                                        <div className="text-base font-custom1">
                                          {dayjs(payment.date).format(
                                            'MMM DD, YYYY'
                                          )}
                                        </div>
                                      </td>
                                      <td className="px-2 text-base align-middle font-custom1">
                                        {payment.description}
                                      </td>
                                      <td className="align-top ttext-right">
                                        <Icon
                                          name="Uncheck"
                                          className="mt-1 ml-2 cursor-pointer stroke-redButton"
                                          viewBox="0 0 18 18"
                                          size="12"
                                          onClick={() =>
                                            openModalDeletePayment(
                                              payment.uuid,
                                              item.dealUuid
                                            )
                                          }
                                        />
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        );
                      })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
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
      <DialogModal
        closeModal={closeModalAddPayment}
        isOpen={isOpenAddPayment}
        dialogTitle={t('add-important-date')}
      >
        <div className="mt-10">
          {updateUUID && (
            <AddPaymentSpecific
              deal={updateUUID}
              handleRefresh={handleRefresh}
            />
          )}
        </div>
      </DialogModal>
      <DialogModal
        closeModal={closeModalGeneralPayment}
        isOpen={isOpenGeneralPayment}
        dialogTitle={t('chat.payment-schedule')}
      >
        <div className="mt-10">
          {updateUUID && (
            <AddPayments
              deal={updateUUID}
              handleRefresh={handleRefresh}
              lookup={true}
            />
          )}
        </div>
      </DialogModal>
      <DialogModal
        closeModal={closeModalPayment}
        isOpen={isOpenPayment}
        dialogTitle={t('add-important-date')}
      >
        <div className="mt-10">
          {paymentSchedule && (
            <AddPaymentAllTypes
              handleRefresh={handleRefresh}
              paymentSchedule={paymentSchedule}
            />
          )}
        </div>
      </DialogModal>
    </>
  );
};

export default ImportantDates;
