import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { Sidebar } from '@chatscope/chat-ui-kit-react';
import { useChat } from '@chatscope/use-chat';
import { NextRouter, useRouter } from 'next/router';
import { tr } from 'date-fns/locale';

import AvatarButtonChat from 'components/AvatarButtons/AvatarButtonChat';
import Icon from 'components/Icon';
import useStore from 'modules/Store';
import routes from 'constants/routes';
import VerifiedMark from 'components/new/VerifiedMark';

const ChatSidebar = () => {
  const { t } = useTranslation();
  const router: NextRouter = useRouter();
  const [searchEnabled, setSearchEnabled] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const conversations = useStore((state) => state.chat.conversations);

  const { activeConversation, getUser } = useChat();

  const matchesSearchTerm = (name: string) => {
    return name.toLowerCase().includes(searchTerm.toLowerCase());
  };

  const handleConversationFocus = (conversationId: string) => {
    if (activeConversation?.id !== conversationId) {
      router.push(routes.chatConversation, `${routes.chat}/${conversationId}`);
    }
  };

  const handleDisplayConversations = () => {
    return conversations.map((c) => {
      const [avatar, name, chatName] = (() => {
        if (c.participantUuids.length === 0)
          return [undefined, undefined, undefined];
        const participant: string | undefined = c.participantUuids.find(
          (item) => getUser(item)
        );
        const user = participant ? getUser(participant) : null;
        if (user && participant && c.item?.images && c.item?.name) {
          return [
            <AvatarButtonChat
              src={c.item.imageLogo ? c.item.imageLogo : c.item.images[0]}
              key={participant}
              className="my-4 bg-white border-4 border-white shadow-sm"
            />,
            <div key={user.data.companyName} className="whitespace-nowrap">
              <span className="mr-2 whitespace-pre-line">
                {user.data.companyName}
              </span>
              {user.data.verifiedUser && (
                <span className="relative top-0.5">
                  <VerifiedMark show={true} hideInfo />
                </span>
              )}
            </div>,
            c.conversationName,
          ];
        }

        return [undefined, undefined, undefined];
      })();

      if (name === undefined || !matchesSearchTerm(c.item.name)) return;

      const isActive = activeConversation?.id === c.uuid;
      const activeClass = isActive
        ? ' bg-white rounded-lg shadow-lg border border-blue-400'
        : ' bg-white rounded-lg shadow-lg';

      return (
        <div
          key={c.uuid}
          className={
            'conversation-card flex items-evenly mx-4 my-6 transition-all duration-300 hover:-translate-y-1 focus:bg-gradient-to-r focus:from-[#79C9E7] focus:to-[#887EF1]' +
            activeClass
          }
          onClick={() => handleConversationFocus(c.uuid)}
        >
          {avatar}
          <div className="flex flex-col ml-4">
            <div className={'text-xl font-bold font-custom1 text-primary'}>
              {name}
            </div>
            <div className={'text-base font-custom1 text-inputGray'}>
              {chatName}
            </div>
          </div>
          {c?.unreadCount ? (
            <div className="absolute flex items-center justify-center px-2 py-1 text-xs rounded-xl bg-gradientHome top-2 right-2 font-custom2 text-primary">
              +{c?.unreadCount}
              <Icon
                name="Messages"
                className="ml-1 fill-primary"
                viewBox="0 0 14 12"
                size="14"
              />
            </div>
          ) : null}
        </div>
      );
    });
  };

  return (
    <Sidebar
      position="left"
      scrollable
      className="flex flex-col w-full py-4 bg-transparent border-0 md:pr-4 md:w-1/5 grow-0 shrink-0 md:border-r-2 border-horizontalDivider min-w-[270px]"
    >
      {/* ONLY ON MOBILE */}
      <div className="fixed top-0 left-0 z-50 w-full md:hidden">
        <div className="flex items-center justify-center w-full px-5 py-4 bg-white border-b-2 md:hidden border-horizontalDivider">
          <div className="absolute left-5 top-4">
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
                {t('chat.explore')}
              </div>
            </div>
          </div>
          <div className="text-xl font-bold font-custom1">
            {t('chat.conversations')}
          </div>
        </div>
      </div>
      <div className="relative py-2 pl-4 pr-4 mt-10 bg-white md:hidden">
        <div className="absolute inset-y-0 flex items-center w-full pl-4 pointer-events-none left-2">
          <Icon
            name="Search"
            viewBox="0 0 24 24"
            size="24"
            className="mt-1 cursor-pointer fill-inputGray"
          />
        </div>
        <input
          type="text"
          id="input-group-1"
          className="bg-backgroundInput text-inputGray text-base rounded focus:border-button block w-full pl-10 2xl:mr-4 p-2.5 shadow-sm cursor-pointer"
          placeholder={t('chat.search-bar-deal-room')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="flex-row items-center justify-between hidden p-2 my-4 md:flex">
        {searchEnabled ? (
          <div className="flex items-center py-2 ml-2 rounded-lg bg-backgroundInput">
            <Icon
              name="Search"
              viewBox="0 0 24 24"
              size="24"
              className="ml-4 cursor-pointer"
              onClick={() => setSearchEnabled(true)}
            />
            <input
              type="text"
              className="w-4/5 ml-4 mr-8 text-lg bg-transparent rounded outline-0 text-primary"
              placeholder="Search by deals"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Icon
              name="Uncheck"
              viewBox="0 0 18 18"
              size="18"
              className="mr-4 cursor-pointer"
              onClick={() => setSearchEnabled(false)}
            />
          </div>
        ) : (
          <>
            <span className="mx-4 text-3xl font-bold font-custom1">
              {t('chat.deal-rooms')}
            </span>
            <div className="flex flex-row items-center h-full mx-4">
              <Icon
                name="Search"
                viewBox="0 0 24 24"
                size="24"
                className="cursor-pointer"
                onClick={() => setSearchEnabled(true)}
              />
            </div>
          </>
        )}
      </div>
      <div className="pb-20 pr-4 md:pb-0 md:pr-0">
        {handleDisplayConversations()}
      </div>
    </Sidebar>
  );
};

export default ChatSidebar;
