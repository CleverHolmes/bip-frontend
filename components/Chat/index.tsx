import React, { useState } from 'react';
import { useChat } from '@chatscope/use-chat';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';

import ChatDetails from 'components/ChatDetails';
import ChatSidebar from 'components/ChatSidebar';
import MessageContainer from 'components/MessageContainer';
import Icon, { IconNames } from 'components/Icon';
import useStore from 'modules/Store';

const ButtonGroupButton = ({
  onClick,
  item,
  selected,
  children,
  icon,
}: {
  onClick: any;
  item: string;
  selected: string;
  children: any;
  icon: IconNames;
}) => {
  return (
    <div
      className={
        'w-1/3 px-3 py-2 text-sm bg-white leading-5 font-medium font-custom1 focus:z-10 transition ease-in-out duration-150 -ml-px first:ml-auto first:rounded-l-md last:rounded-r-md flex flex-col justify-center items-center' +
        (item === selected ? ' text-button' : ' text-inputGray')
      }
      onClick={() => onClick(item)}
    >
      <Icon
        name={icon}
        className={`ml-2 cursor-pointer ${
          item === selected ? 'fill-button' : 'fill-primary'
        }`}
        viewBox="0 0 24 24"
        size="22"
      />
      <div>{children}</div>
    </div>
  );
};

const Chat = () => {
  const { activeConversation } = useChat();
  const { t } = useTranslation();
  const conversations = useStore((state) => state.chat.conversations);
  const [screenMobile, setScreenMobile] = useState<string>('select-chat');
  return (
    <>
      {conversations.length > 0 ? (
        <>
          <div className="hidden md:block">
            <div className="main-chat-container" style={{ height: '86vh' }}>
              <ChatSidebar />
              <MessageContainer />
              {activeConversation ? <ChatDetails /> : null}
            </div>
          </div>
          <div className="flex flex-col md:hidden">
            <div className="fixed bottom-0 left-0 z-50 flex items-center justify-center w-full m-auto">
              <ButtonGroupButton
                item="select-chat"
                onClick={setScreenMobile}
                selected={screenMobile}
                icon="ChatMultiple"
              >
                {t('chat.mobile-tab-1')}
              </ButtonGroupButton>
              <ButtonGroupButton
                item="active-chat"
                onClick={setScreenMobile}
                selected={screenMobile}
                icon="ChatSingle"
              >
                {t('chat.mobile-tab-2')}
              </ButtonGroupButton>
              <ButtonGroupButton
                item="sidebar"
                onClick={setScreenMobile}
                selected={screenMobile}
                icon="Documents"
              >
                {t('chat.mobile-tab-3')}
              </ButtonGroupButton>
            </div>
            <div className="w-full" style={{ height: '100vh' }}>
              {screenMobile === 'select-chat' ? (
                <ChatSidebar />
              ) : screenMobile === 'active-chat' ? (
                <MessageContainer />
              ) : activeConversation ? (
                <ChatDetails />
              ) : null}
            </div>
          </div>
        </>
      ) : (
        <div className="grid h-screen text-xl place-items-center font-custom1 text-inputGray">
          <div className="flex flex-col items-center justify-center pb-40 text-lg text-center font-custom1 text-inputGray">
            <Image
              src={'/images/AddProduct/HourglassSandTop.png'}
              alt="No deals yet"
              height={100}
              width={100}
              objectFit="contain"
            />
            <div className="mt-10">
              {t('chat.you-currently-have-no-deals-open')}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chat;
