import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useQueryClient } from '@tanstack/react-query';

import useStore from 'modules/Store';
import InputDate from 'components/InputDate';
import RadioButton from 'components/RadioButton';
import { paymentTypes } from 'public/helpers/data';
import { AddToPaymentScheduleRequest } from 'models/contract/payments';
import { FooterButtonsFour } from 'components/FooterButtonFolder/FooterButtonsFour';
import CircleLoaderSpinner from 'components/CircleLoaderSpinner';
import { throwError } from 'utils/error';
import { addPaymentToScheduleCall } from 'api/contract/addPaymentToSchedule';
import InputNoRegister from 'components/InputNoRegister';
import { retrievePaymentSchedulesQueryKey } from 'api/contract/retrievePaymentSchedules';
import useTokensOrCookies from 'contexts/TokensOrCookies';
import { getCurrentUuid } from 'utils/getCurrentUuid';

interface Props {
  deal: string;
  handleRefresh: () => void;
}

const AddPaymentSpecific: React.FC<Props> = ({ deal, handleRefresh }) => {
  const { t } = useTranslation();
  const { companyRepresented } = useTokensOrCookies();
  const queryClient = useQueryClient();
  const userUUID = useStore((state) => state.userUUID);
  const [paymentDate, setPaymentDate] = useState<Date>();
  const [selectedRadioType, setSelectedRadioType] = useState<
    'Advance Due' | 'Minimum Guarantee Due' | 'Other' | 'Quarterly Report'
  >();

  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [input, setInput] = useState<string>('');

  const handleChange = (e: any) => {
    setInput(e.target.value);
  };

  const radioHandlerType = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedRadioType(
      event.target.value as
        | 'Advance Due'
        | 'Minimum Guarantee Due'
        | 'Other'
        | 'Quarterly Report'
    );
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<boolean>(false);

  const submitPayment = async () => {
    setIsSubmitting(true);
    if (
      !paymentDate ||
      !selectedRadioType ||
      (selectedRadioType === 'Other' && input.length === 0)
    ) {
      setSubmitError(true);
      setIsSubmitting(false);
    }

    if (!!paymentDate && !!selectedRadioType) {
      try {
        setIsDisabled(true);
        const item: AddToPaymentScheduleRequest = {
          dealUuid: deal,
          userUuid: getCurrentUuid(),
          date: paymentDate,
          paymentEventType:
            selectedRadioType === 'Advance Due'
              ? 'PaymentAdvanceDue'
              : selectedRadioType === 'Quarterly Report'
              ? 'QuarterlyReportDue'
              : selectedRadioType === 'Minimum Guarantee Due'
              ? 'PaymentMinimumGuaranteeDue'
              : 'PaymentOtherDue',
        };

        if (selectedRadioType === 'Other') {
          if (input.length > 0) {
            item.description = input;
          } else {
            setIsSubmitting(false);
            setIsDisabled(false);
            return;
          }
        }

        const paymentSchedule = await addPaymentToScheduleCall(item);
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
            <RadioButton
              radioObject={paymentTypes}
              label="payments.payments-type"
              radioHandler={radioHandlerType}
              selectedRadio={selectedRadioType}
              size="extra-small"
            />
            {selectedRadioType === 'Other' && (
              <div className="mt-5">
                <InputNoRegister
                  name="other"
                  placeholder="Enter type"
                  type="text"
                  value={input}
                  onChange={handleChange}
                  smaller
                />
              </div>
            )}
          </div>

          <div className="mb-24 sm:mb-48 lg:mb-24">
            <InputDate
              label="payments.payment-date"
              name="paymentScheduleDate"
              startDate={paymentDate}
              setStartDate={setPaymentDate}
            />
          </div>

          <FooterButtonsFour
            onClickButton={submitPayment}
            disabled={isDisabled}
            buttonText={t('confirm-and-send-button')}
            error={submitError ? t('errors:all-fields-must-be-filled') : ''}
          />
        </>
      ) : (
        <CircleLoaderSpinner size={500} />
      )}
    </div>
  );
};

export default AddPaymentSpecific;
