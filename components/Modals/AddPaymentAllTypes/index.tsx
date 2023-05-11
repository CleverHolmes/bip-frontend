import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';
import dayjs from 'dayjs';
import { useQueryClient } from '@tanstack/react-query';

import { paymentTypesAll } from 'public/helpers/data';
import useStore from 'modules/Store';
import InputDate from 'components/InputDate';
import { savePaymentScheduleCall } from 'api/contract/savePaymentSchedule';
import RadioButton from 'components/RadioButton';
import { anchor, frequency } from 'public/helpers/data';
import { previewPaymentScheduleCall } from 'api/contract/previewPaymentSchedule';
import {
  AddToPaymentScheduleRequest,
  PaymentSchedulesResponse,
  PreviewPaymentScheduleResponse,
  RetrievePaymentSchedulesResponse,
} from 'models/contract/payments';
import { FooterButtonsFour } from 'components/FooterButtonFolder/FooterButtonsFour';
import CircleLoaderSpinner from 'components/CircleLoaderSpinner';
import { throwError } from 'utils/error';
import InputNoRegister from 'components/InputNoRegister';
import { addPaymentToScheduleCall } from 'api/contract/addPaymentToSchedule';
import { retrievePaymentSchedulesQueryKey } from 'api/contract/retrievePaymentSchedules';
import useTokensOrCookies from 'contexts/TokensOrCookies';
import { getCurrentUuid } from 'utils/getCurrentUuid';

interface Props {
  handleRefresh: () => void;
  paymentSchedule: RetrievePaymentSchedulesResponse;
}

const AddPaymentAllTypes: React.FC<Props> = ({
  handleRefresh,
  paymentSchedule,
}) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { companyRepresented } = useTokensOrCookies();
  const userUUID = useStore((state) => state.userUUID);
  const [paymentsStartDate, setPaymentsStartDate] = useState<Date>();
  const [paymentsEndDate, setPaymentsEndDate] = useState<Date>();
  const [selectedRadioFrequency, setSelectedRadioFrequency] = useState<
    'Monthly' | 'Quarterly' | 'Annually'
  >();
  const [selectedRadioAnchor, setSelectedRadioAnchor] = useState<
    'Start of the month' | 'End of the month'
  >();
  const [paymentDate, setPaymentDate] = useState<Date>();
  const [selectedRadioType, setSelectedRadioType] = useState<
    | 'Advance Due'
    | 'Minimum Guarantee Due'
    | 'Other'
    | 'Royalty'
    | 'Quarterly Report'
  >();

  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [input, setInput] = useState<string>('');

  const [previewPayments, setPreviewPayments] =
    useState<PreviewPaymentScheduleResponse>();

  const radioHandlerFrequency = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSelectedRadioFrequency(
      event.target.value as 'Monthly' | 'Quarterly' | 'Annually' | undefined
    );
  };

  const radioHandlerAnchor = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedRadioAnchor(
      event.target.value as
        | 'Start of the month'
        | 'End of the month'
        | undefined
    );
  };

  const handleChange = (e: any) => {
    setInput(e.target.value);
  };

  const radioHandlerType = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedRadioType(
      event.target.value as
        | 'Advance Due'
        | 'Minimum Guarantee Due'
        | 'Other'
        | 'Royalty'
        | 'Quarterly Report'
        | undefined
    );
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<boolean>(false);

  const submitPayment = async () => {
    setIsSubmitting(true);
    if (
      !paymentsEndDate ||
      !paymentsStartDate ||
      !selectedRadioFrequency ||
      !selectedRadioAnchor ||
      !dealName
    ) {
      setSubmitError(true);
      setIsSubmitting(false);
    }

    if (
      !!paymentsEndDate &&
      !!paymentsStartDate &&
      !!selectedRadioFrequency &&
      !!selectedRadioAnchor &&
      !!dealName
    ) {
      try {
        setIsDisabled(true);
        const paymentSchedule = await savePaymentScheduleCall({
          dealUuid: dealName,
          userUuid: getCurrentUuid(),
          paymentScheduleDateStart: paymentsStartDate,
          paymentScheduleDateEnd: paymentsEndDate,
          paymentScheduleDateFrequency: selectedRadioFrequency,
          paymentScheduleDateAnchor:
            selectedRadioAnchor === 'Start of the month' ? 'Start' : 'End',
          paymentScheduleBusinessDaysOnly: true,
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

  const submitPaymentSpecific = async () => {
    setIsSubmitting(true);
    if (
      !paymentDate ||
      !selectedRadioType ||
      (selectedRadioType === 'Other' && input.length === 0) ||
      !dealName
    ) {
      setSubmitError(true);
      setIsSubmitting(false);
    }

    if (!!paymentDate && !!selectedRadioType && !!dealName) {
      try {
        setIsDisabled(true);
        const item: AddToPaymentScheduleRequest = {
          dealUuid: dealName,
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
          dealUuid: dealName,
          userUuid: getCurrentUuid(),
        });
        setPreviewPayments(paymentSchedulePreview);
      } catch (error) {
        throwError(error);
      }
    }
  };

  const [dealName, setDealName] = useState('');

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
          <div className="flex items-center justify-between">
            <select
              id="property-name"
              className="bg-backgroundInput border border-inputGray text-lg font-custom1 md:text-xl lg:text-2xl text-primary rounded-lg focus:ring-button focus:border-button block w-full p-2.5 mb-10"
              onChange={(event) => setDealName(event.target.value)}
            >
              <option defaultValue={'Choose A Deal'}>Choose a deal</option>
              {paymentSchedule.map(
                (item: PaymentSchedulesResponse, index: number) => {
                  return (
                    <option
                      value={item.dealUuid}
                      key={index}
                      className="text-primary"
                    >
                      {item.dealName}
                    </option>
                  );
                }
              )}
            </select>
          </div>

          <div className="mb-16">
            <RadioButton
              radioObject={paymentTypesAll}
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
          {selectedRadioType && selectedRadioType !== 'Royalty' && (
            <div className="mb-24 sm:mb-48 lg:mb-24">
              <InputDate
                label="payments.payment-date"
                name="paymentScheduleDate"
                startDate={paymentDate}
                setStartDate={setPaymentDate}
              />
            </div>
          )}
          {selectedRadioType && selectedRadioType === 'Royalty' && (
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
              <div className="mb-24 sm:mb-48 lg:mb-24">
                <RadioButton
                  radioObject={anchor}
                  label="payments.when-should-payments-be-made"
                  radioHandler={radioHandlerAnchor}
                  selectedRadio={selectedRadioAnchor}
                  size="extra-small"
                />
              </div>
            </>
          )}
          {previewPayments && (
            <>
              <div className="mb-2 text-lg font-bold font-custom1">
                {t('chat.preview-payment-schedule')}
              </div>
              <div className="w-full p-5 mb-20 rounded-lg sm:mb-40 bg-backgroundInput">
                {previewPayments.paymentSchedule.map((paymentDate: string) => {
                  return (
                    <div key={paymentDate} className="mb-1">
                      {dayjs(paymentDate).format('MMM DD, YYYY')}
                    </div>
                  );
                })}
              </div>
            </>
          )}
          {selectedRadioType && selectedRadioType === 'Royalty' ? (
            <FooterButtonsFour
              onClickButton={submitPayment}
              onClickButton2={previewPaymentSchedule}
              disabled={isDisabled}
              buttonText={t('confirm-and-send-button')}
              buttonText2={t('chat.preview')}
              error={submitError ? t('errors:all-fields-must-be-filled') : ''}
            />
          ) : (
            <FooterButtonsFour
              onClickButton={submitPaymentSpecific}
              disabled={isDisabled}
              buttonText={t('confirm-and-send-button')}
              error={submitError ? t('errors:all-fields-must-be-filled') : ''}
            />
          )}
        </>
      ) : (
        <CircleLoaderSpinner size={500} />
      )}
    </div>
  );
};

export default AddPaymentAllTypes;
