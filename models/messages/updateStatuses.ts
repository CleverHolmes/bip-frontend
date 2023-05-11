export type StatusItem = {
  messageUuid: string;
  read: boolean;
};

export type UpdateStatusesRequest = {
  userUuid: string;
  statuses: StatusItem[];
};

export type UpdateStatusesResponse = {
  statusUpdateCount: number;
};
