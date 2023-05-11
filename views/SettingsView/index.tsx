import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { NextRouter, useRouter } from 'next/router';

import useStore from 'modules/Store';
import ProfileViewCard from 'components/ProfileViewCard';
import { AccountFlags, UserRoles } from 'models/user/user';
import useAgent from 'hooks/useAgent';
import { getCurrentUuid } from 'utils/getCurrentUuid';
import { getUserCall, getUserQueryKey } from 'api/user/getUserCall';
import useTokensOrCookies from 'contexts/TokensOrCookies';
import routes from 'constants/routes';
import CircleLoaderSpinner from 'components/CircleLoaderSpinner';
import useCheckNonInteractiveUser from 'hooks/useCheckNonInteractiveUser';

type Props = {
  children?: React.ReactNode;
};

const SettingsView: React.FC<Props> = ({ children }) => {
  const userUUID = useStore((state) => state.userUUID);
  const accountFlags = useStore((state) => state.account_flags);
  const { companyRepresented, operatingUser } = useTokensOrCookies();
  const [isAbleToAddAuthorized, setIsAbleToAddAuthorized] =
    useState<boolean>(false);

  const { t } = useTranslation();
  const isAgent = useAgent();
  const { isNonInteractive } = useCheckNonInteractiveUser();
  const router: NextRouter = useRouter();
  const currentRoute = router.pathname;

  const currentUuid = getCurrentUuid();

  const { data: userData, isLoading } = useQuery({
    queryKey: [getUserQueryKey, currentUuid],
    queryFn: async () => {
      return await getUserCall(currentUuid);
    },
    enabled: !!currentUuid,
    onSuccess: () => {
      useStore.setState({ actingAsNewUser: false });
    },
  });

  useLayoutEffect(() => {
    if (!operatingUser || operatingUser === userUUID) {
      setIsAbleToAddAuthorized(true);
    } else {
      setIsAbleToAddAuthorized(false);
    }
  }, [operatingUser, companyRepresented, userUUID]);

  useEffect(() => {
    if (currentRoute === routes.settings) {
      router.push(routes.settingsProfile);
    }
  }, [currentRoute]);

  return (
    <>
      {!isLoading && (
        <div className="relative max-w-full min-h-screen grid-cols-1 md:grid lg:container lg:mx-auto md:grid-cols-10">
          <div className="pt-10 pb-5 mx-5 md:pb-20 md:border-r-2 md:col-span-3 lg:mx-0 border-horizontalDivider lg:pt-16">
            <div className="font-extrabold font-custom1 text2xl lg:text-4xl text-primary mb-7">
              {t('settings.settings')}
            </div>
            <div className="flex md:flex-col">
              <Link href={routes.settingsProfile}>
                <a>
                  <ProfileViewCard
                    image="Person.svg"
                    title={t('settings.profile-and-company')}
                    isActive={currentRoute === routes.settingsProfile}
                    type="Settings"
                  />
                </a>
              </Link>
              {!isNonInteractive && (
                <Link href={routes.settingsNotifications}>
                  <a>
                    <ProfileViewCard
                      image="Pie.svg"
                      title={t('settings.notifications')}
                      isActive={currentRoute === routes.settingsNotifications}
                      type="Settings"
                    />
                  </a>
                </Link>
              )}
              {!isAgent && userData?.roles?.includes('licensor') && (
                <Link href={routes.settingsBrands}>
                  <a>
                    <ProfileViewCard
                      image="Flame.svg"
                      title={t('settings.brands')}
                      isActive={currentRoute === routes.settingsBrands}
                      type="Settings"
                      id="viewBrands"
                    />
                  </a>
                </Link>
              )}
              {isAgent && (
                <Link href={routes.settingsLicensors}>
                  <a>
                    <ProfileViewCard
                      image="Flame.svg"
                      title={t('settings.licensors')}
                      isActive={currentRoute === routes.settingsLicensors}
                      type="Settings"
                      id="viewLicensors"
                    />
                  </a>
                </Link>
              )}
              {!accountFlags.includes(AccountFlags.AUTHORIZED_USER) &&
                isAbleToAddAuthorized && (
                  <Link href={routes.settingsAuthorizedUsers}>
                    <a>
                      <ProfileViewCard
                        image="Squares.svg"
                        title={t('settings.authorized-users')}
                        isActive={
                          currentRoute === routes.settingsAuthorizedUsers
                        }
                        type="Settings"
                        id="authorizedUser"
                      />
                    </a>
                  </Link>
                )}
            </div>
            {/* <div className="relative py-2 my-6 mr-4 rounded-lg sm:my-4 md:py-6 bg-gradientHome">
            <div className="py-2 ml-12 text-base font-bold font-custom1 text-primary">
              Invite Friend
            </div>
            <div className="flex items-center">
              <div className="ml-12 text-base font-bold font-custom1 text-blue2">
                ABCDEFG
              </div>
              <Icon
                name="Chain"
                className="mt-1 ml-1 stroke-blue2 fill-transparent"
                viewBox="0 0 26 26"
                size="14"
              />
            </div>
            <div className="absolute top-0 left-0 z-10 hidden md:inline-flex">
              <Image
                src={`/images/Home/Blob1.svg`}
                alt="design-attribute"
                width="80px"
                height="60px"
              />
            </div>
            <div className="absolute bottom-0 right-0 z-10 hidden md:inline-flex">
              <Image
                src={`/images/Home/Blob2.svg`}
                alt="design-attribute-2"
                width="90px"
                height="40px"
              />
            </div>
          </div> */}
          </div>
          <div className="pt-10 mx-5 md:mx-10 md:col-span-7 lg:pt-16">
            {children}
          </div>
        </div>
      )}
      {isLoading && (
        <div className="flex w-full mt-[150px]">
          <CircleLoaderSpinner className="mx-auto" size={500} />
        </div>
      )}
    </>
  );
};

export default SettingsView;
