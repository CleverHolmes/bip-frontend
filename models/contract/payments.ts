export type SavePaymentScheduleRequest = {
  dealUuid: string;
  userUuid: string;
  paymentScheduleDateStart: Date;
  paymentScheduleDateEnd: Date;
  paymentScheduleDateFrequency: 'Monthly' | 'Quarterly' | 'Annually';
  paymentScheduleDateAnchor: 'Start' | 'End';
  paymentScheduleBusinessDaysOnly: boolean;
};

export type SavePaymentScheduleResponse = {
  uuid: string;
};

export type PreviewPaymentScheduleRequest = {
  userUuid: string;
  dealUuid: string;
  paymentScheduleDateStart: Date;
  paymentScheduleDateEnd: Date;
  paymentScheduleDateFrequency: 'Monthly' | 'Quarterly' | 'Annually';
  paymentScheduleDateAnchor: 'Start' | 'End';
  paymentScheduleBusinessDaysOnly: boolean;
};

export type PreviewPaymentScheduleResponse = {
  paymentSchedule: string[];
  paymentScheduleDetails: PaymentScheduleDetails[];
};

export type RetrievePaymentScheduleRequest = {
  dealUuid: string;
  userUuid: string;
};

export type PaymentScheduleDetails = {
  uuid: string;
  paymentEventType:
    | 'PaymentRoyaltyMonthlyDue'
    | 'PaymentRoyaltyQuarterlyDue'
    | 'PaymentRoyaltyAnnualDue'
    | 'PaymentMinimumGuaranteeDue'
    | 'PaymentAdvanceDue'
    | 'QuarterlyReportDue'
    | 'PaymentOtherDue';
  description: string;
  date: Date;
};

export type RetrievePaymentScheduleResponse = {
  dealUuid: string;
  paymentSchedule: string[];
  paymentScheduleDetails: PaymentScheduleDetails[];
  dealName: string;
  paymentScheduleDateStart: Date;
  paymentScheduleDateEnd: Date;
  paymentScheduleDateFrequency: 'Monthly' | 'Quarterly' | 'Annually';
  paymentScheduleDateAnchor: 'Start' | 'End';
  paymentScheduleBusinessDaysOnly: boolean;
};

export type RetrievePaymentSchedulesRequest = {
  userUuid: string;
};

export type PaymentSchedulesResponse = {
  dealUuid: string;
  paymentSchedule: string[];
  dealName: string;
  paymentScheduleDateStart: Date;
  paymentScheduleDateEnd: Date;
  paymentScheduleDateFrequency: 'Monthly' | 'Quarterly' | 'Annually';
  paymentScheduleDateAnchor: 'Start' | 'End';
  paymentScheduleBusinessDaysOnly: boolean;
  paymentScheduleDetails: PaymentScheduleDetails[];
};

export type RetrievePaymentSchedulesResponse = Array<PaymentSchedulesResponse>;

export type AddToPaymentScheduleRequest = {
  userUuid: string;
  dealUuid: string;
  paymentEventType:
    | 'PaymentAdvanceDue'
    | 'QuarterlyReportDue'
    | 'PaymentMinimumGuaranteeDue'
    | 'PaymentOtherDue';
  description?: string;
  date: Date;
};

export type AddToPaymentScheduleResponse = {
  paymentSchedule: [Date];
  payment_schedule_details: [
    {
      uuid: string;
      description: string;
      paymentEventType:
        | 'PaymentRoyaltyMonthlyDue'
        | 'PaymentRoyaltyQuarterlyDue'
        | 'PaymentRoyaltyAnnualDue'
        | 'PaymentMinimumGuaranteeDue'
        | 'PaymentAdvanceDue'
        | 'QuarterlyReportDue'
        | 'PaymentOtherDue';
      date: Date;
    }
  ];
};

export type RemovePaymentFromScheduleRequest = {
  userUuid: string;
  dealUuid: string;
  paymentScheduleUuid: string;
};

export type RemovePaymentFromScheduleResponse = {
  paymentSchedule: string[];
  payment_schedule_details: PaymentScheduleDetails[];
};
