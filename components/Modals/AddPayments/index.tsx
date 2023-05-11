import React, { useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import dayjs from 'dayjs';
import { useQueryClient } from '@tanstack/react-query';

import useStore from 'modules/Store';
import InputDate from 'components/InputDate';
import { savePaymentScheduleCall } from 'api/contract/savePaymentSchedule';
import RadioButton from 'components/RadioButton';
import { anchor, frequency } from 'public/helpers/data';
import { previewPaymentScheduleCall } from 'api/contract/previewPaymentSchedule';
import {
  PreviewPaymentScheduleResponse,
  RetrievePaymentScheduleResponse,
} from 'models/contract/payments';
import { FooterButtonsFour } from 'components/FooterButtonFolder/FooterButtonsFour';
import CircleLoaderSpinner from 'components/CircleLoaderSpinner';
import { throwError } from 'utils/error';
import { retrievePaymentScheduleCall } from 'api/contract/retrievePaymentSchedule';
import { retrievePaymentSchedulesQueryKey } from 'api/contract/retrievePaymentSchedules';
import useTokensOrCookies from 'contexts/TokensOrCookies';
import { getCurrentUuid } from 'utils/getCurrentUuid';

interface Props {
  deal: string;
  lookup?: boolean;
  currentPaymentSchedule?: RetrievePaymentScheduleResponse | undefined;
  handleRefresh: () => void;
}

const AddPayments: React.FC<Props> = ({
  deal,
  currentPaymentSchedule,
  handleRefresh,
  lookup,
}) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const userUUID = useStore((state) => state.userUUID);
  const [paymentsStartDate, setPaymentsStartDate] = useState<Date>();
  const [paymentsEndDate, setPaymentsEndDate] = useState<Date>();
  const [selectedRadioFrequency, setSelectedRadioFrequency] = useState<
    'Monthly' | 'Quarterly' | 'Annually'
  >();
  const [selectedRadioAnchor, setSelectedRadioAnchor] = useState<
    'Start of the month' | 'End of the month'
  >();

  const [isDisabled, setIsDisabled] = useState<boolean>(false);

  const { companyRepresented } = useTokensOrCookies();

  const radioHandlerFrequency = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSelectedRadioFrequency(
      event.target.value as 'Monthly' | 'Quarterly' | 'Annually'
    );
  };

  const radioHandlerAnchor = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedRadioAnchor(
      event.target.value as 'Start of the month' | 'End of the month'
    );
  };

  useEffect(() => {
    // check any of the fields to see if they exist
    if (!!lookup) return;
    if (currentPaymentSchedule?.paymentScheduleDateAnchor) {
      if (currentPaymentSchedule?.paymentScheduleDateEnd) {
        setPaymentsEndDate(
          new Date(currentPaymentSchedule?.paymentScheduleDateEnd)
        );
      }
      setSelectedRadioFrequency(
        currentPaymentSchedule?.paymentScheduleDateFrequency
      );
      setSelectedRadioAnchor(
        currentPaymentSchedule?.paymentScheduleDateAnchor !== 'Start'
          ? 'End of the month'
          : 'Start of the month'
      );
      if (currentPaymentSchedule?.paymentScheduleDateStart) {
        setPaymentsStartDate(
          new Date(currentPaymentSchedule?.paymentScheduleDateStart)
        );
      }
    }
  }, [currentPaymentSchedule, lookup]);

  useEffect(() => {
    if (!lookup) return;
    retrievePaymentScheduleCall({
      dealUuid: deal,
      userUuid: getCurrentUuid(),
    })
      .then((res) => {
        if (res.paymentScheduleDateEnd)
          setPaymentsEndDate(new Date(res.paymentScheduleDateEnd));
        setSelectedRadioFrequency(res.paymentScheduleDateFrequency);
        setSelectedRadioAnchor(
          res.paymentScheduleDateAnchor !== 'Start'
            ? 'End of the month'
            : 'Start of the month'
        );
        if (res.paymentScheduleDateStart)
          setPaymentsStartDate(new Date(res.paymentScheduleDateStart));
      })
      .catch((err) => {
        throwError(err);
      });
  }, [deal, companyRepresented, userUUID, lookup]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<boolean>(false);

  const submitPayment = async () => {
    setIsSubmitting(true);
    if (
      !paymentsEndDate ||
      !paymentsStartDate ||
      !selectedRadioFrequency ||
      !selectedRadioAnchor
    ) {
      setSubmitError(true);
      setIsSubmitting(false);
    }

    if (
      !!paymentsEndDate &&
      !!paymentsStartDate &&
      !!selectedRadioFrequency &&
      !!selectedRadioAnchor
    ) {
      try {
        setIsDisabled(true);
        const paymentSchedule = await savePaymentScheduleCall({
          dealUuid: deal,
          userUuid: getCurrentUuid(),
          paymentScheduleDateStart: paymentsStartDate,
          paymentScheduleDateEnd: paymentsEndDate,
          paymentScheduleDateFrequency: selectedRadioFrequency,
          paymentScheduleDateAnchor:
            selectedRadioAnchor === 'Start of the month' ? 'Start' : 'End',
          paymentScheduleBusinessDaysOnly: true,
        });
        queryClient.invalidateQueries({
          queryKey: [retrievePaymentSchedulesQueryKey],
        });
        setIsSubmitting(false);
        setSubmitSuccess(true);
        setIsDisabled(false);
        handleRefresh();
      } catch (error) {
        throwError(error);
        setIsSubmitting(false);
        setIsDisabled(false);
      }
    }
  };

  const [paymentSchedule, setPaymentSchedule] =
    useState<PreviewPaymentScheduleResponse>();

  const previewPaymentSchedule = async () => {
    if (
      !paymentsEndDate ||
      !paymentsStartDate ||
      !selectedRadioFrequency ||
      !selectedRadioAnchor
    ) {
      setSubmitError(true);
    }

    if (
      !!paymentsEndDate &&
      !!paymentsStartDate &&
      !!selectedRadioFrequency &&
      !!selectedRadioAnchor
    ) {
      try {
        const paymentSchedulePreview = await previewPaymentScheduleCall({
          paymentScheduleDateStart: paymentsStartDate,
          paymentScheduleDateEnd: paymentsEndDate,
          paymentScheduleDateFrequency: selectedRadioFrequency,
          paymentScheduleDateAnchor:
            selectedRadioAnchor === 'Start of the month' ? 'Start' : 'End',
          paymentScheduleBusinessDaysOnly: true,
          dealUuid: deal,
          userUuid: getCurrentUuid(),
        });
        setPaymentSchedule(paymentSchedulePreview);
      } catch (error) {
        throwError(error);
      }
    }
  };

  return (
    <div className="sm:min-w-[500px] md:min-w-[600px] z-50">
      {submitSuccess ? (
        <div className="grid h-max place-items-center">
          <div className="px-4 py-6 mt-20 mr-5 text-3xl font-bold text-primary lg:text-5xl font-custom1">
            {t('chat.congratulations')}
          </div>
          <div className="px-4 py-2 mb-20 mr-5 text-lg text-primary font-custom1">
            {t('important-date-has-been-submitted')}
          </div>
        </div>
      ) : !isSubmitting ? (
        <>
          <div className="mb-16">
            <InputDate
              label="payments.payments-start-date"
              name="paymentScheduleDateStart"
              startDate={paymentsStartDate}
              setStartDate={setPaymentsStartDate}
            />
          </div>
          <div className="mb-16">
            <InputDate
              label="payments.payments-end-date"
              name="paymentScheduleDateEnd"
              startDate={paymentsEndDate}
              setStartDate={setPaymentsEndDate}
            />
          </div>
          <div className="mb-16">
            <RadioButton
              radioObject={frequency}
              label="payments.payments-frequency"
              radioHandler={radioHandlerFrequency}
              selectedRadio={selectedRadioFrequency}
              size="extra-small"
            />
          </div>
          <div className="mb-16">
            <RadioButton
              radioObject={anchor}
              label="payments.when-should-payments-be-made"
              radioHandler={radioHandlerAnchor}
              selectedRadio={selectedRadioAnchor}
              size="extra-small"
            />
          </div>
          {paymentSchedule && (
            <>
              <div className="mb-2 text-lg font-bold font-custom1">
                {t('chat.preview-payment-schedule')}
              </div>
              <div className="w-full p-5 mb-20 rounded-lg sm:mb-40 bg-backgroundInput">
                {paymentSchedule.paymentSchedule.map((paymentDate: string) => {
                  return (
                    <div key={paymentDate} className="mb-1">
                      {dayjs(paymentDate).format('MMM DD, YYYY')}
                    </div>
                  );
                })}
              </div>
            </>
          )}
          <FooterButtonsFour
            onClickButton={submitPayment}
            onClickButton2={previewPaymentSchedule}
            disabled={isDisabled}
            buttonText={t('confirm-and-send-button')}
            buttonText2={t('chat.preview')}
            error={submitError ? t('errors:all-fields-must-be-filled') : ''}
          />
        </>
      ) : (
        <CircleLoaderSpinner size={500} />
      )}
    </div>
  );
};

export default AddPayments;
