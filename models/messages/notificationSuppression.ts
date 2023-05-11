export type NotificationSuppressionRequest = {
  userUuid: string;
  dealUuid: string;
  token: string;
};

export type NotificationSuppressionResponse = {
  userUuid: string;
  dealUuid: string;
};
