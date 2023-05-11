export type SendConversationRequest = {
  user_uuid: string;
  deal_uuid: string;
  conversation_name: string;
  participant_uuids: string[];
};

export type SendConversationResponse = {
  uuid: string;
  errorMessage: string;
};
