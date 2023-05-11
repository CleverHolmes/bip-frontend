import { NextRouter, useRouter } from 'next/router';
import { Fragment, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { toast } from 'react-toastify';
import { Popover, Transition } from '@headlessui/react';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';

import AvatarButton from 'components/AvatarButtons/AvatarButton';
import Accordion from 'components/Accordions/Accordion';
import useStore from 'modules/Store';
import Toast from 'components/Toast';
import { delegate, delegateQueryKey } from 'api/delegate/delegate';
import {
  findUserByUuid,
  findUserByUuidQueryKey,
} from 'api/user/findUserByUuid';
import Icon from 'components/Icon';
import { throwError } from 'utils/error';
import customImageLoader from 'utils/image-loader';
import useTokensOrCookies from 'contexts/TokensOrCookies';
import useStorage from 'hooks/useStorage';
import useAuth, { COOKIE_CONSENT } from 'hooks/useAuth';
import routes from 'constants/routes';
import { Delegate } from 'models/delegate/delegate';
import useCheckRole from 'hooks/useCheckRole';
import {UserRoles} from "models/user/user";

const AvatarButtonOptions = () => {
  const router: NextRouter = useRouter();
  const { setItem } = useStorage();
  const userUUID = useStore((state) => state.userUUID);
  const nameAgency = useStore((state) => state.company_name);
  const companyLogo = useStore((state) => state.company_logo);
  const refreshUserAppWrapper = useStore(
    (state) => state.refreshUserAppWrapper
  );
  const { companyRepresented, handleSetCompanyRepresented } =
    useTokensOrCookies();
  const [cookies, setCookie] = useCookies([
    'company_represented',
    COOKIE_CONSENT,
  ]);
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { isAgency } = useCheckRole();
  const { logout } = useAuth();

  const { data: company } = useQuery({
    queryKey: [findUserByUuidQueryKey, userUUID, companyRepresented],
    queryFn: async () => {
      return await findUserByUuid(companyRepresented || userUUID);
    },
    enabled: !!userUUID && isAgency,
    onError: (err) => {
      throwError(err);
    },
  });

  const { data: delegates } = useQuery({
    queryKey: [delegateQueryKey, userUUID],
    queryFn: async () => {
      return await delegate({
        params: { delegate_uuid: userUUID },
      });
    },
    enabled: !!userUUID && isAgency,
    onError: (err) => {
      throwError(err);
    },
  });

  useEffect(() => {
    if (!refreshUserAppWrapper) return;
    queryClient.invalidateQueries({
      queryKey: [findUserByUuidQueryKey],
    });
    queryClient.invalidateQueries({
      queryKey: [delegateQueryKey],
    });
  }, [refreshUserAppWrapper]);

  return (
    <>
      <Popover className="relative">
        {({ open, close }) => (
          <>
            <Popover.Button
              className={`
                ${open ? '' : ' text-opacity-90'}
                  mr-4 font-custom2 text-lg cursor-pointer flex justify-center items-center focus:outline-none`}
            >
              <AvatarButton />
              {isAgency && (
                <div className="absolute w-5 h-5 overflow-hidden text-white bg-white border-2 rounded-xl -bottom-1 right-2 shrink-0 sm:h-6 sm:w-6 border-inputGray hover:border-button hover:bg-button">
                  {company?.company_logo && !!company.company_logo.uri && (
                    <Image
                      loader={customImageLoader}
                      src={company.company_logo.uri}
                      alt="ProfileImage"
                      layout="fill"
                      objectFit={'contain'}
                      width={24}
                      className="mx-auto my-auto rounded-xl"
                    />
                  )}
                </div>
              )}
            </Popover.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Popover.Panel className="absolute right-0 z-40 w-screen max-w-xs px-4 mt-3 transform bg-white sm:max-w-sm -translate-x-0 sm:px-0 lg:max-w-md">
                <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                  {isAgency && (
                    <div className="relative grid gap-4 bg-white p-7 lg:grid-cols-1">
                      {/* AGENT */}
                      <div
                        className={`flex items-center p-2 -my-3 transition duration-150 ease-in-out rounded-lg hover:bg-backgroundInput focus:outline-none focus-visible:ring focus-visible:ring-blueText focus-visible:ring-opacity-50 ${
                          userUUID === companyRepresented
                            ? 'text-green'
                            : 'text-inputGray'
                        } hover:text-button px-3 2xl:px-3.5`}
                        key={userUUID}
                        onClick={() => {
                          const isConsent = cookies.CookieConsent === 'true';
                          handleSetCompanyRepresented(userUUID);
                          if (isConsent) {
                            setCookie('company_represented', userUUID, {
                              path: '/',
                              maxAge: 60 * 60 * 24 * 365,
                            });
                          } else {
                            setItem('company_represented', userUUID, 'session');
                          }
                          toast(
                            <Toast
                              message={`Your are now acting on behalf of ${nameAgency}`}
                            />
                          );
                          useStore.setState({ actingAsNewUser: true });
                        }}
                      >
                        <div className="flex items-center justify-center w-10 h-10 text-white shrink-0 sm:h-12 sm:w-12">
                          {!!companyLogo.uri && (
                            <div className="flex flex-row items-center">
                              <Icon
                                name="Crown"
                                viewBox="0 0 128 128"
                                size="16"
                                className="mr-4 ml-4"
                              />
                              <div
                                className={`relative flex items-center justify-center w-12 h-12 uppercase border-2 rounded-xl bg-white cursor-pointer max-h-12 max-w-12  ${
                                  userUUID === companyRepresented
                                    ? ' border-green bg-green'
                                    : ' border-backgroundInput'
                                }`}
                              >
                                <Image
                                  loader={customImageLoader}
                                  src={companyLogo.uri}
                                  alt="ProfileImage"
                                  layout="fill"
                                  width={48}
                                  objectFit={'contain'}
                                  className={`mx-auto rounded-xl`}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <p className="mx-4 text-base cursor-pointer font-custom2">
                            {nameAgency}
                          </p>
                        </div>
                      </div>

                      {/* DELEGATES */}
                      {!!delegates?.length && (
                        <Accordion
                          title={t('settings.licensors')}
                          smaller
                          maxHeight="350px"
                        >
                          {delegates?.map((item: Delegate) => (
                            <div
                              className={`flex items-center mb-1 last:mb-0 p-2 -m-3 transition duration-150 ease-in-out rounded-lg hover:bg-backgroundInput focus:outline-none focus-visible:ring focus-visible:ring-blueText focus-visible:ring-opacity-50 ${
                                item.uuid === companyRepresented
                                  ? 'text-green'
                                  : 'text-inputGray'
                              } hover:text-button px-3 2xl:px-3.5`}
                              key={item.uuid}
                              onClick={() => {
                                const isConsent =
                                  cookies.CookieConsent === 'true';
                                handleSetCompanyRepresented(item.uuid);
                                if (isConsent) {
                                  setCookie('company_represented', item.uuid, {
                                    path: '/',
                                    maxAge: 60 * 60 * 24 * 365,
                                  });
                                } else {
                                  setItem(
                                    'company_represented',
                                    item.uuid,
                                    'session'
                                  );
                                }
                                toast(
                                  <Toast
                                    message={`Your are now acting on behalf of ${item.company_name}`}
                                  />
                                );
                                useStore.setState({ actingAsNewUser: true });

                                if (item.roles.includes(UserRoles.LICENSOR)) {
                                  router.push(routes.settingsBrands);
                                } else {
                                  router.push(routes.settingsProfile);
                                }
                              }}
                            >
                              <div className="flex items-center justify-center w-10 h-10 text-white shrink-0 sm:h-12 sm:w-12">
                                {!!item.company_logo.uri && (
                                  <div
                                    className={`relative flex items-center justify-center w-12 h-12 uppercase border-2 rounded-xl cursor-pointer max-h-12 max-w-12 bg-white  ${
                                      item.uuid === companyRepresented
                                        ? ' border-green bg-green'
                                        : ' border-backgroundInput'
                                    }`}
                                  >
                                    <Image
                                      loader={customImageLoader}
                                      src={item.company_logo.uri}
                                      alt="ProfileImage"
                                      layout="fill"
                                      width={48}
                                      objectFit={'contain'}
                                      className={`mx-auto rounded-xl`}
                                    />
                                  </div>
                                )}
                              </div>
                              <div className="ml-4">
                                <p className="mx-4 text-base cursor-pointer font-custom2">
                                  {item.company_name}
                                </p>
                              </div>
                            </div>
                          ))}
                        </Accordion>
                      )}
                    </div>
                  )}
                  {isAgency && (
                    <Link href={routes.addLicensor}>
                      <a>
                        <div className="relative grid gap-8 bg-backgroundInput p-2 lg:grid-cols-1">
                          <div className="py-6 px-6 flex items-center -m-3 transition duration-150 ease-in-out rounded-lg hover:bg-backgroundInput focus:outline-none focus-visible:ring focus-visible:ring-blueText focus-visible:ring-opacity-50 text-inputGray hover:text-button">
                            <Icon name="PlusCircle" size="24" />
                            <span className="ml-4">
                              {t('settings.add-licensor')}
                            </span>
                          </div>
                        </div>
                      </a>
                    </Link>
                  )}
                  <Link href={routes.settingsProfile}>
                    <a>
                      <div className="relative grid gap-8 bg-backgroundInput p-2 lg:grid-cols-1">
                        <div className="flex items-center py-6 px-6 -m-3 transition duration-150 ease-in-out rounded-lg hover:bg-backgroundInput focus:outline-none focus-visible:ring focus-visible:ring-blueText focus-visible:ring-opacity-50 text-inputGray hover:text-button">
                          <Icon name="Settings" viewBox="0 0 24 24" size="24" />
                          <span className="ml-4">{t('settings.settings')}</span>
                        </div>
                      </div>
                    </a>
                  </Link>
                  <a
                    onClick={() => {
                      logout();
                      close();
                    }}
                    className="cursor-pointer"
                  >
                    <div className="relative grid gap-8 bg-backgroundInput p-2 lg:grid-cols-1">
                      <div className="flex items-center py-6 px-6 -m-3 transition duration-150 ease-in-out rounded-lg hover:bg-backgroundInput focus:outline-none focus-visible:ring focus-visible:ring-blueText focus-visible:ring-opacity-50 text-inputGray hover:text-button">
                        <Icon name="Exit" viewBox="0 0 20 20" size="24" />
                        <span className="ml-4">{t('settings.logout')}</span>
                      </div>
                    </div>
                  </a>
                </div>
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    </>
  );
};

export default AvatarButtonOptions;
