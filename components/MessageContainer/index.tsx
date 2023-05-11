import { useEffect, useRef, useState } from 'react';
import { NextRouter, useRouter } from 'next/router';
import ReactTooltip from 'react-tooltip';
import { InputToolbox } from '@chatscope/chat-ui-kit-react';
import {
  AttachmentContent,
  ChatMessage,
  MessageContentType,
  MessageDirection,
  useChat,
} from '@chatscope/use-chat';
import { MessageGroup } from '@chatscope/use-chat/dist/MessageGroup';

import MessageSeparator from 'components/MessageSeparator';
import FileMessage from 'components/FileMessage';
import ChatInput from 'components/ChatInput';
import AvatarButtonChat from 'components/AvatarButtons/AvatarButtonChat';
import Icon from 'components/Icon';

const MessageContainer = () => {
  const router: NextRouter = useRouter();
  const [tooltip, showTooltip] = useState(true);
  const messagesEnd = useRef<HTMLDivElement>(null);
  const ONE_HOUR = 60 * 60 * 1000; /* ms */

  const { currentMessages, activeConversation, getUser, currentMessage } =
    useChat();

  useEffect(() => {
    if (!currentMessage) handleScrollToBottom();
  });

  const handleScrollToBottom = () => {
    if (messagesEnd.current) {
      messagesEnd.current.scrollIntoView(false);
    }
  };

  const getDateStringForMessage = (
    message: ChatMessage<MessageContentType>
  ): string => {
    return (
      message.createdTime.toLocaleDateString() +
      ' ' +
      message.createdTime.toLocaleTimeString()
    );
  };

  const renderMessage = (
    message: ChatMessage<MessageContentType>,
    incoming: boolean
  ): JSX.Element => {
    const messageTextColor = incoming ? 'text-primary' : 'text-white';
    const messageBackgroundColor = incoming
      ? 'rgba(124, 139, 158, 0.04)'
      : 'linear-gradient(248.72deg, #4AA7CA -19.92%, #4FBAF0 127.66%)';

    return (
      <>
        <div
          id={message.id}
          key={message.id}
          className={
            'rounded-xl py-2 px-4 max-w-xs text-left mb-1 ' + messageTextColor
          }
          style={{
            background: messageBackgroundColor,
            wordWrap: 'break-word',
          }}
          data-tip={getDateStringForMessage(message)}
          onMouseEnter={() => showTooltip(true)}
          onMouseLeave={() => {
            showTooltip(false);
            setTimeout(() => showTooltip(true), 50);
          }}
        >
          {message.contentType === MessageContentType.TextHtml ? (
            (message.content as unknown as string)
          ) : (
            <FileMessage
              messageAttachment={message.content as AttachmentContent}
            />
          )}
        </div>
      </>
    );
  };

  const renderMessagesWithinGroup = (
    group: MessageGroup,
    previousMessageDate: Date,
    msgIdx: number,
    incoming: boolean
  ): [JSX.Element[], Date, number, boolean] => {
    let msgElements: JSX.Element[] = [];
    let done = false;

    while (msgIdx < group.messages.length) {
      const message = group.messages[msgIdx];
      if (
        previousMessageDate.getTime() + ONE_HOUR <
        message.createdTime.getTime()
      ) {
        done = true;
        break;
      }

      msgElements.push(renderMessage(message, incoming));

      previousMessageDate = message.createdTime;
      msgIdx++;
    }

    return [msgElements, previousMessageDate, msgIdx, done];
  };

  const renderMessages = (
    groupIdx: number,
    msgIdx: number
  ): [JSX.Element[], number, number] => {
    let msgElements: JSX.Element[] = [];
    let previousMessageDate: Date =
      currentMessages[groupIdx].messages[msgIdx].createdTime;

    while (groupIdx < currentMessages.length) {
      const group = currentMessages[groupIdx];
      const username = getUser(group.senderId)?.data.companyName;
      const incoming = group.direction === MessageDirection.Incoming;
      const incomingMessageClass = incoming ? 'justify-start' : 'justify-end';
      const avatarOrder = incoming ? 'order-first' : 'order-last';
      const messagesOrder = incoming ? 'order-last' : 'order-first';
      const textAlign = incoming ? 'text-left' : 'text-right';
      const messagesAlign = incoming ? 'items-start' : 'items-end';

      const [messages, lastMessageDate, lastMsgIdx, isDone] =
        renderMessagesWithinGroup(group, previousMessageDate, msgIdx, incoming);
      if (messages.length === 0) {
        msgIdx = lastMsgIdx;
        break;
      }

      msgElements.push(
        <div className={'flex flex-row my-2 ' + incomingMessageClass}>
          <div className={'flex flex-col mx-2 ' + messagesOrder}>
            <span className={'text-xs mb-1 font-custom2 ' + textAlign}>
              {username}
            </span>
            <div className={'flex flex-col font-custom2 ' + messagesAlign}>
              {messages}
            </div>
          </div>
          <AvatarButtonChat
            className={'flex flex-col items-end h-full ' + avatarOrder}
            src={getUser(group.senderId)?.data.companyLogo}
            user={getUser(group.senderId)?.id}
          />
        </div>
      );

      if (isDone) {
        msgIdx = lastMsgIdx;
        break;
      }

      previousMessageDate = lastMessageDate;
      groupIdx++;
      msgIdx = 0;
    }

    return [msgElements, groupIdx, msgIdx];
  };

  const handleDisplayMessages = () => {
    let elements: JSX.Element[] = [];
    let groupIdx = 0;
    let msgIdx = 0;

    while (groupIdx < currentMessages.length) {
      const message = currentMessages[groupIdx].messages[msgIdx];
      elements.push(
        <MessageSeparator>
          <span className="text-sm">{getDateStringForMessage(message)} </span>
        </MessageSeparator>
      );

      const [addedElements, newGroupIdx, newMsgIdx] = renderMessages(
        groupIdx,
        msgIdx
      );
      elements = [...elements, ...addedElements];
      msgIdx = newMsgIdx;
      groupIdx = newGroupIdx;
    }
    return elements;
  };

  return (
    <div className="flex flex-col h-full border-0 md:mt-0 md:pt-0 basis-1/2 grow">
      {tooltip && <ReactTooltip place="right" effect="solid" />}
      {activeConversation && (
        <>
          <div className="border-0 conversation-header">
            {/* ONLY ON DESKTOP */}
            <div className="flex-row items-center justify-start hidden bg-transparent border-0 md:flex">
              <div className="flex flex-row items-end h-full p-1 mx-4 bg-transparent">
                <AvatarButtonChat
                  key="1"
                  src={
                    activeConversation.data?.imageLogo ||
                    activeConversation.data?.images?.[0] ||
                    ''
                  }
                  className="border-4 border-white "
                  onClick={() => {
                    const user = getUser(activeConversation.data.userUuid);
                    user &&
                      router.push(
                        `/product/${user.data.companyName}/${activeConversation.data.uuid}`
                      );
                  }}
                  size="large"
                />
                <div className="flex -ml-4">
                  {activeConversation.participants.map((p) => {
                    const user = getUser(p.id);
                    return (
                      <>
                        <AvatarButtonChat
                          key={p.id}
                          src={user?.data.companyLogo}
                          size="small"
                          className="border-4 border-white "
                          onClick={() => router.push(`/company/${user?.id}`)}
                        />
                      </>
                    );
                  })}
                </div>
              </div>
              <div className="flex flex-col bg-transparent">
                <span className="text-4xl font-bold font-custom1">
                  {activeConversation.data.name}
                </span>
                <span className="flex items-center text-sm font-custom2 text-inputGray">
                  {activeConversation.participants.map((p, index) => {
                    const user = getUser(p.id);
                    return (
                      <div key={user?.data.companyName}>
                        {user?.data.companyName}
                        {index < activeConversation.participants.length - 1 && (
                          <span>&nbsp;•&nbsp;</span>
                        )}
                      </div>
                    );
                  })}
                </span>
              </div>
            </div>
            {/* ONLY ON MOBILE */}
            <div className="fixed top-0 left-0 z-50 w-full md:hidden">
              <div className="flex justify-between w-full px-5 py-4 bg-white border-b-2 md:hidden border-horizontalDivider">
                <div
                  className="flex flex-row items-center"
                  onClick={() => router.push('/explore')}
                >
                  <Icon
                    name="Back"
                    className="inline-block mt-1 cursor-pointer fill-button"
                    viewBox="0 0 18 18"
                    size="16"
                  />
                  <div className="text-base font-custom1 text-button">
                    Explore
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-lg font-bold text-center font-custom1">
                    {activeConversation.data.name}
                  </div>
                  <div className="flex flex-row flex-wrap items-center justify-center text-sm text-center font-custom1 text-inputGray">
                    {activeConversation.participants.map((p, index) => {
                      const user = getUser(p.id);
                      return (
                        <div key={user?.data.companyName}>
                          {user?.data.companyName}
                          {index <
                            activeConversation.participants.length - 1 && (
                            <span>&nbsp;•&nbsp;</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="flex flex-row mt-1">
                  {activeConversation.participants.map((p) => {
                    const user = getUser(p.id);
                    return (
                      <>
                        <AvatarButtonChat
                          key={p.id}
                          src={user?.data.companyLogo}
                          size="small"
                          className="border-4 border-white "
                          onClick={() => router.push(`/company/${user?.id}`)}
                        />
                      </>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          <div
            className="box-border relative w-full h-full pt-[70px] pb-40 pl-5 pr-5 overflow-auto md:pt-0 md:pb-0 md:pr-0"
            style={{ minHeight: '1.25em' }}
          >
            {handleDisplayMessages()}
            <div
              style={{ float: 'left', clear: 'both' }}
              ref={messagesEnd}
            ></div>
          </div>
          <InputToolbox className="fixed left-0 z-10 flex items-center w-full bg-white bottom-12 md:bottom-0 md:bg-transparent md:relative">
            <ChatInput />
          </InputToolbox>
        </>
      )}
    </div>
  );
};

export default MessageContainer;
