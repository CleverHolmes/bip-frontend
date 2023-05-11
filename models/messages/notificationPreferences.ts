export enum NotificationPreferenceEnum {
  CONTRACT_UPLOADED = 'Contract_Uploaded',
  CONTRACT_SIGNATURE_TABS_PLACED = 'Contract_Signature_Tabs_Placed',
  CONTRACT_AGREED_UPON = 'Contract_Agreed_Upon',
  CONTRACT_SENT_TO_DOCUSIGN = 'Contract_Sent_To_DocuSign',
  DEAL_DRAFT_CREATED = 'Deal_Draft_Created',
  DEAL_PROPOSAL_AVAILABLE = 'Deal_Proposal_Available',
  DEAL_REVISION_AVAILABLE = 'Deal_Revision_Available',
  DEAL_PROPOSAL_ACCEPTED = 'Deal_Proposal_Accepted',
  DEAL_PROPOSAL_REJECTED = 'Deal_Proposal_Rejected',
  DEAL_FILE_UPLOADED = 'Deal_File_Uploaded',
  DEAL_ROOM_CREATED = 'Deal_Room_Created ',
}

export type NotificationPreference = {
  notificationType: NotificationPreferenceEnum;
  enabled: boolean;
};

export type GetNotificationPreferencesRequest = {
  userUuid: string;
};

export type GetNotificationPreferencesResponse = {
  userUuid: string;
  notificationPreferences: NotificationPreference[];
};

export type PostNotificationPreferencesRequest = {
  userUuid: string;
  notificationPreferences: NotificationPreference[];
};

export type PostNotificationPreferencesResponse = {
  userUuid: string;
  notificationPreferences: NotificationPreference[];
};
