export type ConversationRequest = {
  userUuid?: string;
};

export type ConversationItem = {
  uuid: string;
  userUuid: string;
  dealUuid: string;
  imageLogo: string;
  conversationName: string;
  participantUuids: string[];
  createdAt: string;
  unreadCount: number;
  item: Item;
};

export type ParticipantItem = {
  uuid: string;
  nameFirst: string;
  nameLast: string;
  avatar?: {
    uri: string;
  };
  companyLogo: {
    uri: string;
  };
  companyName: string;
  verifiedUser: boolean;
};

export type ConversationResponse = {
  messageConversations: ConversationItem[];
  participants: ParticipantItem[];
};

export type Item = {
  description: string;
  imageLogo: string;
  images: string[];
  name: string;
  uuid: string;
};
