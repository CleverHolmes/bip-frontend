import {
  ConversationItem,
  ParticipantItem,
} from 'models/messages/conversation';
import { MessageResponse } from 'models/messages/message';
import { StoreState } from 'modules/Store';

const actions = (set: any, initialState: StoreState) => ({
  addParticipants: (participants: ParticipantItem[]) =>
    set(
      (state: StoreState) => ({
        ...state,
        chat: {
          ...state.chat,
          participants,
        },
      }),
      true
    ),
  addConversations: (conversations: ConversationItem[]) =>
    set(
      (state: StoreState) => ({
        ...state,
        chat: {
          ...state.chat,
          conversations,
        },
        chatStoragePopulated: true,
      }),
      true
    ),
  addMessages: (conversationUuid: string, messages: MessageResponse[]) =>
    set(
      (state: StoreState) => ({
        ...state,
        chat: {
          ...state.chat,
          messages: {
            ...state.chat.messages,
            [conversationUuid]: [
              ...(state.chat.messages[conversationUuid] || []),
              ...messages,
            ],
          },
        },
      }),
      true
    ),
  updateMessageStatus: (
    conversationUuid: string,
    index: number,
    read: boolean
  ) =>
    set((state: StoreState) => {
      const newMessages = { ...state.chat.messages };
      if (newMessages[conversationUuid][index].messageStatus) {
        newMessages[conversationUuid][index].messageStatus.read = read;
      }

      return {
        ...state,
        chat: {
          ...state.chat,
          messages: newMessages,
        },
      };
    }, true),
  updateConversationUnreadCount: (uuid: string, unreadCount: number) =>
    set((state: StoreState) => {
      const index = state.chat.conversations.findIndex(
        (conversation) => conversation.uuid === uuid
      );
      const newConversations = [...state.chat.conversations];

      if (index !== -1) {
        newConversations[index].unreadCount = unreadCount;
      }

      return {
        ...state,
        chat: {
          ...state.chat,
          conversations: newConversations,
        },
      };
    }, true),
  updateActiveConversation: (uuid: string) =>
    set((state: StoreState) => {
      return {
        ...state,
        chat: {
          ...state.chat,
          activeConversation: uuid,
        },
      };
    }, true),
  resetChat: () =>
    set((state: StoreState) => {
      return {
        ...state,
        chat: initialState.chat,
        chatStoragePopulated: false,
      };
    }, true),
});

export default actions;
