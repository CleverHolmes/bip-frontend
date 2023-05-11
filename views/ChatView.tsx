import React, { useEffect } from 'react';
import Image from 'next/image';
import { Loader } from '@chatscope/chat-ui-kit-react';
import { NextRouter, useRouter } from 'next/router';
import { useChat } from '@chatscope/use-chat';

import ChatComponent from 'components/Chat';
import useStore from 'modules/Store';
import { ConversationItem } from 'models/messages/conversation';
import routes from 'constants/routes';

const ChatView: React.FC = () => {
  const store = useStore();
  const conversations = useStore((state) => state.chat.conversations);
  const activeConversation = useStore((state) => state.chat.activeConversation);
  const updateActiveConversation = useStore(
    (state) => state.updateActiveConversation
  );

  const router: NextRouter = useRouter();
  const { setActiveConversation } = useChat();

  const { conversationId } = router.query;

  useEffect(() => {
    if (activeConversation && !conversationId) {
      router.push(
        routes.chatConversation,
        `${routes.chat}/${activeConversation}`
      );
    }
  }, []);

  useEffect(() => {
    if (conversationId) {
      setActiveConversation(conversationId as string);
      updateActiveConversation(conversationId as string);
    }
  }, [conversationId]);

  useEffect(() => {
    if (conversations.length && !conversationId) {
      conversations.map((conversation: ConversationItem, index) => {
        if (!activeConversation && index === 0) {
          router.push(
            routes.chatConversation,
            `${routes.chat}/${conversation.uuid}`
          );
        }
      });
    }
  }, [conversations, conversationId]);

  return (
    <>
      <div className="fixed bottom-0 right-0 overflow-hidden pointer-events-none">
        <Image
          src="/images/BackgroundBlur.svg"
          alt="background-blur"
          width={1353}
          height={524}
          objectPosition="right bottom"
          layout="fixed"
        />
      </div>
      {store.chatStoragePopulated ? (
        <ChatComponent />
      ) : (
        <Loader style={{ height: '90vh', width: '100%' }} />
      )}
    </>
  );
};

export default ChatView;
