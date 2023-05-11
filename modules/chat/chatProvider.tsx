import { nanoid } from 'nanoid';
import { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import {
  AutoDraft,
  BasicStorage,
  ChatProvider,
  IStorage,
  UpdateState,
  useChat,
} from '@chatscope/use-chat';

import useStore from '../../modules/Store';
import ChatService from './chatService';
import { createConversation, createMessage, createUser } from './utils';
import { getCurrentUuid } from 'utils/getCurrentUuid';
import { getMessage } from 'api/messages/getMessage';
import { getConversation } from 'api/messages/getConversation';
import { updateStatuses } from 'api/messages/updateStatuses';
import { MessageResponse } from 'models/messages/message';
import {
  ConversationItem,
  ParticipantItem,
} from 'models/messages/conversation';
import { StatusItem } from 'models/messages/updateStatuses';
import useAuth from 'hooks/useAuth';
import usePrevious from 'hooks/usePrevious';
import useTokensOrCookies from 'contexts/TokensOrCookies';

type Props = {
  children: React.ReactNode;
};

// Storage needs to generate id for messages and groups
const messageIdGenerator = () => nanoid();
const groupIdGenerator = () => nanoid();

const chatStorage = new BasicStorage({ groupIdGenerator, messageIdGenerator });

const StateProvider = ({ children }: Props) => {
  const addParticipants = useStore((state) => state.addParticipants);
  const addConversations = useStore((state) => state.addConversations);
  const addMessages = useStore((state) => state.addMessages);
  const updateMessageStatus = useStore((state) => state.updateMessageStatus);
  const updateConversationUnreadCount = useStore(
    (state) => state.updateConversationUnreadCount
  );
  const participants = useStore((state) => state.chat.participants);
  const conversations = useStore((state) => state.chat.conversations);
  const messages = useStore((state) => state.chat.messages);
  const resetChat = useStore((state) => state.resetChat);
  const senderUuid = getCurrentUuid();
  const prevSenderUuid = usePrevious(senderUuid);

  const {
    getUser,
    addUser,
    addConversation,
    addMessage,
    activeConversation,
    setActiveConversation,
    currentMessages,
  } = useChat();
  const { isLogged } = useAuth();

  useEffect(() => {
    if (isLogged && prevSenderUuid && senderUuid !== prevSenderUuid) {
      resetChat();
      setActiveConversation('');
    }
  }, [isLogged, senderUuid]);

  useEffect(() => {
    if (isLogged && senderUuid) {
      populateConversations();
    }
  }, [isLogged, senderUuid]);

  useEffect(() => {
    if (activeConversation?.id) {
      const conversationMessages = messages[activeConversation.id] || [];
      const isConversationLoadedOnce: boolean =
        conversationMessages.filter(
          (message) => message.messageConversationUuid === activeConversation.id
        ).length > 0;
      const latestMessage: MessageResponse =
        conversationMessages[conversationMessages.length - 1];

      Promise.all([
        getMessage({
          userUuid: senderUuid,
          messageConversationUuid: activeConversation.id,
          afterCreatedAt: isConversationLoadedOnce
            ? latestMessage?.createdAt || undefined
            : undefined,
        }),
      ]).then(([data]) => {
        addMessages(activeConversation.id, data);

        data.forEach((message: MessageResponse) => {
          addMessage(
            createMessage(message),
            message.messageConversationUuid,
            false
          );
        });

        updateMessagesStatus(data);
      });
    }
  }, [activeConversation?.id]);

  useEffect(() => {
    const conversation = conversations.find(
      (conversation) => conversation.uuid === activeConversation?.id
    );
    const conversationMessages = activeConversation
      ? messages[activeConversation.id]
      : [];

    if (conversation?.unreadCount) {
      updateConversationUnreadCount(conversation.uuid, 0);
    } else if (conversationMessages?.length && activeConversation) {
      const message: MessageResponse =
        conversationMessages[conversationMessages.length - 1];
      const lastMessagesGroup = currentMessages[currentMessages.length - 1];
      const isMessageAdded = !!lastMessagesGroup?.messages.find(
        (item) => item.id === message.uuid
      );

      if (!isMessageAdded && !message.messageStatus?.read) {
        addMessage(
          createMessage(message),
          message.messageConversationUuid,
          false
        );

        if (activeConversation?.id === message.messageConversationUuid) {
          updateMessagesStatus([message], conversationMessages.length - 1);
          updateConversationUnreadCount(activeConversation.id, 0);
        }
      }
    }
  }, [messages]);

  useEffect(() => {
    if (participants.length) {
      participants.map((participant: ParticipantItem) => {
        const user = getUser(participant.uuid);
        if (!user) addUser(createUser(participant));
      });
    }
  }, [participants]);

  useEffect(() => {
    if (conversations.length) {
      conversations.map((conversation: ConversationItem, index) => {
        addConversation(createConversation(conversation));
      });
    }
  }, [conversations]);

  const updateMessagesStatus = async (
    data: MessageResponse[],
    updateIndex?: number
  ) => {
    const statuses: StatusItem[] = [];
    const senderUuid = getCurrentUuid();

    data.forEach((message, index) => {
      if (!message.messageStatus?.read && message.userUuid !== senderUuid) {
        statuses.push({
          messageUuid: message.uuid,
          read: true,
        });
        if (activeConversation) {
          updateMessageStatus(
            activeConversation.id,
            updateIndex || index,
            true
          );
        }
      }
    });

    if (statuses.length) {
      await updateStatuses({
        userUuid: senderUuid,
        statuses,
      });
    }
  };

  const populateConversations = async () => {
    const data = await getConversation({
      userUuid: getCurrentUuid(),
    });
    addParticipants(data.participants);
    addConversations(data.messageConversations);
  };

  return <>{children}</>;
};

const ChatProviderParent = ({ children }: Props) => {
  const { accessToken, companyRepresented } = useTokensOrCookies();

  const cookies = {
    access_token: accessToken,
    company_represented: companyRepresented,
  };
  const serviceFactory = (storage: IStorage, updateState: UpdateState) => {
    return new ChatService(storage, updateState, cookies);
  };

  return (
    <ChatProvider
      serviceFactory={serviceFactory}
      storage={chatStorage}
      config={{
        typingThrottleTime: 250,
        typingDebounceTime: 900,
        debounceTyping: true,
        autoDraft: AutoDraft.Save,
      }}
    >
      <StateProvider>{children}</StateProvider>
    </ChatProvider>
  );
};

export default ChatProviderParent;
