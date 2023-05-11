import React, { FC, useEffect, useState } from 'react';
import Image from 'next/image';
import { NextRouter, useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';

import useAgent from 'hooks/useAgent';
import StyledLink from 'components/StyledLink';
import Icon from 'components/Icon';
import ExploreOptions from 'components/ExploreOptions';
import AvatarButtonOptions from 'components/AvatarButtons/AvatarButtonOptions';
import DropdownMenu, { DropdownItemType } from 'components/DropdownMenu';
import useStore from 'modules/Store';
import routes from 'constants/routes';
import { updateStatuses } from 'api/messages/updateStatuses';
import { environment } from 'modules/config';
import useTokensOrCookies from 'contexts/TokensOrCookies';
import { AccountFlags, UserRoles } from 'models/user/user';
import usePlans from 'wrapper/components/PlansModal/usePlans';
import Button from 'components/Buttons/Button';
import useCheckRole from 'hooks/useCheckRole';
import { checkAccountFlag } from 'utils/checkAccountFlag';
import { checkRole } from 'utils/checkRole';

export const AddItemsButton: FC<{
  companyCookie: string | undefined | null;
  showMobileMenu: boolean;
  setShowMobileMenu: (arg: boolean) => void;
}> = ({ showMobileMenu, setShowMobileMenu }) => {
  const { t } = useTranslation();
  const { isLicensor, isAgency, isActingAsAgency } = useCheckRole();

  return (
    <>
      {(isLicensor || (isAgency && !isActingAsAgency)) && (
        <>
          <Link href={routes.addProduct}>
            <a>
              <Button
                smaller
                icon="Plus"
                onClick={() => {
                  showMobileMenu && setShowMobileMenu(false);
                }}
              >
                {t('header.list-brand')}
              </Button>
            </a>
          </Link>
        </>
      )}
    </>
  );
};

export const NotificationButton: FC<{
  showMobileMenu: boolean;
  setShowMobileMenu: (arg: boolean) => void;
}> = ({ showMobileMenu, setShowMobileMenu }) => {
  const { t } = useTranslation();
  const notifications = useStore((state) => state.notifications);
  const updateNotificationStatus = useStore(
    (state) => state.updateNotificationStatus
  );
  const userUUID = useStore((state) => state.userUUID);
  const operatingUserUUID = useStore((state) => state.uuid_operating_user);

  const amount = notifications
    .slice(-10)
    .filter((notification) => !notification.messageStatus.read).length;
  const items: DropdownItemType[] = notifications
    .slice(-10)
    .map((notification) => ({
      name: notification.message,
      link: notification.uriTarget || routes.dashboard,
      highlight: !notification.messageStatus.read,
      onClick: () => {
        updateNotificationStatus(notification.uuid, true);
        updateStatuses({
          userUuid: operatingUserUUID || userUUID,
          statuses: [
            {
              messageUuid: notification.uuid,
              read: true,
            },
          ],
        });
      },
    }));

  const markAllAsRead = () => {
    notifications.slice(-10).map((notification) => {
      updateNotificationStatus(notification.uuid, true);
      updateStatuses({
        userUuid: operatingUserUUID || userUUID,
        statuses: [
          {
            messageUuid: notification.uuid,
            read: true,
          },
        ],
      });
    });
  };

  return (
    <div>
      <DropdownMenu
        buttonElem={() => (
          <div
            className="mx-8 mt-4 lg:mx-4 2xl:mx-8"
            onClick={() => {
              showMobileMenu && setShowMobileMenu(false);
            }}
          >
            <Icon
              name="Mailbox"
              viewBox="0 0 24 24"
              size="32"
              className="z-40 mt-1 fill-primary hover:fill-button"
            />
            {!!amount && (
              <div className="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white border-2 border-white rounded-full max-w bg-redButton font-custom1 top-1 right-6">
                {amount}
              </div>
            )}
          </div>
        )}
        noResults={t('you-dont-have-new-notifications')}
        items={items}
        panelClasses="max-w-[288px] sm:max-w-sm lg:max-w-lg lg:-translate-x-1/3"
        bottomText={!!items.length ? t('mark-all-as-read') : ''}
        onClickBottom={markAllAsRead}
      />
    </div>
  );
};

interface NavProps {
  setRefresh?: () => void;
}

const NavMain: React.FC<NavProps> = ({ setRefresh }) => {
  const roles = useStore((state) => state.roles);
  const plan = useStore((state) => state.plan);
  const userUUID = useStore((state) => state.userUUID);
  const updatePlansModalOpen = useStore((state) => state.updatePlansModalOpen);
  const updateDueDiligenceModalOpen = useStore(
    (state) => state.updateDueDiligenceModalOpen
  );
  const [showMobileMenu, setShowMobileMenu] = useState<boolean>(false);
  const router: NextRouter = useRouter();
  const { companyRepresented, operatingUser } = useTokensOrCookies();

  const isAgent = useAgent();
  const { showPaymentPlans } = usePlans();
  const { t } = useTranslation();

  const conversations = useStore((state) => state.chat.conversations);
  const isLicensee = checkRole(UserRoles.LICENSEE);
  const dealMakingPermitted = checkAccountFlag(
    AccountFlags.DEAL_MAKING_PERMITTED,
    true
  );
  const dueDiligenceQuestionnaireSubmitted = checkAccountFlag(
    AccountFlags.DUE_DILIGENCE_QUESTIONNAIRE_SUBMITTED,
    true
  );
  const showDD =
    isLicensee && !dealMakingPermitted && !dueDiligenceQuestionnaireSubmitted;

  const setRole = (role: UserRoles.LICENSOR | 'collaboration' | undefined) => {
    useStore.setState({ userCurrentType: role });
  };

  const navbarSearchText = useStore((state) => state.navbarSearchText);

  const [input, setInput] = useState<string>(navbarSearchText);

  const handleChange = (e: any) => {
    setInput(e.target.value);
    useStore.setState({ navbarSearchText: e.target.value });
    if (router.pathname !== 'explore') {
      router.push('/explore');
    }
  };

  const handleShowPlansModal = () => {
    updatePlansModalOpen(true);
  };

  const handleShowDD = () => {
    updateDueDiligenceModalOpen(true);
  };

  useEffect(() => {
    if (input !== '' && navbarSearchText === '') {
      setInput('');
    }
  }, [navbarSearchText]);

  return (
    <div className="w-full bg-white">
      {showPaymentPlans && !plan && (
        <div
          className="w-full py-2 text-sm text-center text-white uppercase md:text-lg bg-primary hover:bg-primaryHover font-custom1 transition duration-150 ease-in-out cursor-pointer"
          onClick={handleShowPlansModal}
        >
          {t('select-your-payment-plan')}
        </div>
      )}
      {showDD && (
        <div
          className="w-full py-2 text-sm text-center text-white md:text-lg bg-primary hover:bg-primaryHover font-custom1 transition duration-150 ease-in-out cursor-pointer"
          onClick={handleShowDD}
        >
          {t('due-diligence.complete-due-diligence-module')}
        </div>
      )}
      {['development'].includes(environment) ? (
        <div className="w-full text-3xl text-center text-white bg-red-300">
          <b>DEVELOPMENT ENVIRONMENT</b>
        </div>
      ) : (
        ''
      )}
      <div
        className={
          'w-full border-b-2 shadow-sm border-borderColor bg-white z-50' +
          (showMobileMenu ? ' fixed top-0 left-0' : '')
        }
      >
        <div className="flex items-center justify-between py-4 mx-6 3xl:container 3xl:mx-auto 3xl:px-6">
          <div className="flex items-center">
            <div
              className="mr-8 xl:mr-12 2xl:mr-10 hover:scale-105"
              style={{ minWidth: 61 }}
            >
              <Image
                src="/images/LogoPrimary.svg"
                width={61}
                height={34}
                alt="BIP logo"
                onClick={() => {
                  if (setRefresh) {
                    setRefresh();
                    useStore.setState({ navbarSearchText: '' });
                    setInput('');
                  }
                  showMobileMenu && setShowMobileMenu(false);
                  router.push('/explore');
                }}
                className="cursor-pointer"
              />
            </div>
            <div className="hidden lg:flex lg:justify-center lg:items-center">
              <div className="relative 3xl:ml-20">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
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
                  className="bg-backgroundInput text-inputGray text-base rounded focus:border-button block w-72 xl:w-96 2xl:w-104 pl-10 2xl:mr-4 p-2.5 shadow-sm cursor-pointer"
                  placeholder={t('navbar.search-bar')}
                  onChange={handleChange}
                  value={input}
                />
              </div>
              <ExploreOptions setRole={setRole} />
              {!isAgent && (
                <StyledLink
                  link="/dashboard"
                  linkTitle={t('header.dashboard')}
                />
              )}
              <StyledLink link="/vault" linkTitle={t('header.vault')} />
              <StyledLink
                link="/deal-status"
                linkTitle={t('header.deal-status')}
                id="dealStatusPage"
              />
              {([UserRoles.LICENSEE, UserRoles.LICENSOR].some((r) =>
                roles.includes(r)
              ) ||
                ([UserRoles.AGENCY].some((r) => roles.includes(r)) &&
                  !!companyRepresented &&
                  userUUID !== companyRepresented)) && (
                <StyledLink
                  link="/chat"
                  linkTitle={t('header.chat')}
                  notifications={conversations.reduce((accumulator, object) => {
                    return accumulator + object.unreadCount;
                  }, 0)}
                  id="chatPage"
                />
              )}
            </div>
          </div>
          <div className="flex items-center">
            <div id="addBrand">
              <AddItemsButton
                companyCookie={companyRepresented}
                showMobileMenu={showMobileMenu}
                setShowMobileMenu={setShowMobileMenu}
              />
            </div>
            <NotificationButton
              showMobileMenu={showMobileMenu}
              setShowMobileMenu={setShowMobileMenu}
            />
            <div id="settingsPage">
              <AvatarButtonOptions />
              {/*{roles.includes(UserRoles.AGENCY) ? (
                <AvatarButtonOptions />
              ) : (
                <div
                  onClick={() => {
                    showMobileMenu && setShowMobileMenu(false);
                    router.push(routes.settingsProfile);
                  }}
                >
                  <AvatarButton />
                </div>
              )}*/}
            </div>
            <div className="lg:hidden">
              <div
                className="space-y-1.5 ml-4"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
              >
                <div className="w-6 h-0.5 bg-inputGray"></div>
                <div className="w-6 h-0.5 bg-inputGray"></div>
                <div className="w-6 h-0.5 bg-inputGray"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={` py-2 flex flex-col h-full min-h-full lg:hidden`}>
        <div className="relative pb-4 mx-4 border-b-2 border-borderColor">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
            <Icon
              name="Search"
              viewBox="0 0 24 24"
              size="24"
              className="mb-3 cursor-pointer fill-inputGray"
            />
          </div>
          <input
            type="text"
            id="input-group-1"
            className="bg-backgroundInput text-inputGray text-base rounded focus:border-button block w-full pl-10 mr-4 p-2.5 shadow-sm cursor-pointer"
            placeholder={t('navbar.search-bar')}
            onChange={handleChange}
            value={input}
          />
        </div>
      </div>
      <div
        className={
          (showMobileMenu ? 'showMenuNav' : 'hidden') +
          ` py-2 flex flex-col h-full min-h-full mt-24`
        }
      >
        <div
          className="text-inputGray hover:text-button px-3 2xl:px-3.5 relative font-custom2 text-lg cursor-pointer mx-8 my-6"
          onClick={() => {
            setRole(UserRoles.LICENSOR);
            router.push('/explore');
            setShowMobileMenu(false);
          }}
        >
          {t('explore-licensors')}
        </div>
        {(roles.includes(UserRoles.LICENSOR) ||
          roles.includes(UserRoles.AGENCY)) && (
          <div
            className="text-inputGray hover:text-button px-3 2xl:px-3.5 relative font-custom2 text-lg cursor-pointer mx-8 my-6"
            onClick={() => {
              setRole('collaboration');
              router.push('/explore');
              setShowMobileMenu(false);
            }}
          >
            {t('explore-collaborations')}
          </div>
        )}
        <div
          className="text-inputGray hover:text-button px-3 2xl:px-3.5 relative font-custom2 text-lg cursor-pointer mx-8 my-6"
          onClick={() => {
            router.push('/vault');
            setShowMobileMenu(false);
          }}
        >
          {t('header.vault')}
        </div>
        {([UserRoles.LICENSEE, UserRoles.LICENSOR].some((r) =>
          roles.includes(r)
        ) ||
          ([UserRoles.AGENCY].some((r) => roles.includes(r)) &&
            !!companyRepresented &&
            userUUID !== companyRepresented)) && (
          <div
            className="text-inputGray hover:text-button px-3 2xl:px-3.5 relative font-custom2 text-lg cursor-pointer mx-8 my-6"
            onClick={() => {
              router.push('/chat');
              setShowMobileMenu(false);
            }}
          >
            {t('header.chat')}
          </div>
        )}
        {!isAgent && (
          <>
            {roles.includes(UserRoles.LICENSEE) ? (
              <div
                className="text-inputGray hover:text-button px-3 2xl:px-3.5 relative font-custom2 text-lg cursor-pointer mx-8 my-6"
                onClick={() => {
                  router.push(`/dashboard`);
                  setShowMobileMenu(false);
                }}
              >
                {t('header.dashboard')}
              </div>
            ) : (
              <div
                className="text-inputGray hover:text-button px-3 2xl:px-3.5 relative font-custom2 text-lg cursor-pointer mx-8 my-6"
                onClick={() => {
                  router.push(`/dashboard`);
                  setShowMobileMenu(false);
                }}
              >
                {t('header.dashboard')}
              </div>
            )}
          </>
        )}
        <div
          className="text-inputGray hover:text-button px-3 2xl:px-3.5 relative font-custom2 text-lg cursor-pointer mx-8 my-6"
          onClick={() => {
            router.push('/deal-status');
            setShowMobileMenu(false);
          }}
        >
          {t('header.deal-status')}
        </div>
      </div>
    </div>
  );
};

export default NavMain;
