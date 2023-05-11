export type SendMessageRequest = {
  messageConversationUuid: string;
  messageType: number;
  message: string;
  userUuid: string;
  uuid?: string;
};

export type SendMessageResponse = {
  uuid: string;
};
