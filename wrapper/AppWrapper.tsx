import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { NextRouter, useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import Joyride, { CallBackProps } from 'react-joyride';
import { useMount } from 'react-use';

import useAuth, { COOKIE_CONSENT } from 'hooks/useAuth';
import useStore from '../modules/Store';
import { getUserCall } from 'api/user/getUserCall';
import { getNotificationCall } from 'api/messages/getNotification';
import websocket from 'modules/websocket';
import { findUserByUuid } from 'api/user/findUserByUuid';
import {
  AccountFlags,
  UserByUuidResponse,
  UserResponse,
  UserRoles,
} from 'models/user/user';
import { throwError } from 'utils/error';
import { setAccountFlagCall } from 'api/user/setAccountFlagCall';
import FirstLoadModals from './components/FirstLoadModals';
import useTokensOrCookies from 'contexts/TokensOrCookies';
import { getCurrentAccountFlags } from 'utils/getCurrentAccountFlags';
import routes from 'constants/routes';

const AppWrapper = ({ children }: any) => {
  const refreshUserAppWrapper = useStore(
    (state) => state.refreshUserAppWrapper
  );
  const userUUID = useStore((state) => state.userUUID);
  const operatingUserUUID = useStore((state) => state.uuid_operating_user);
  const logIn = useStore((state) => state.logIn);
  const addNotifications = useStore((state) => state.addNotifications);

  const run = useStore((state) => state.run);
  const stepIndex = useStore((state) => state.stepIndex);
  const steps = useStore((state) => state.steps);
  const roles = useStore((state) => state.roles);

  const { accessToken, companyRepresented, operatingUser, primaryUser } =
    useTokensOrCookies();

  const [cookies] = useCookies([COOKIE_CONSENT]);

  const accountFlags = getCurrentAccountFlags();

  const [showFirstLoadModals, setShowFirstLoadModals] = useState(false);
  const isOperatingUserActive = operatingUser !== primaryUser;

  useMount(() => {
    const authorizedUser = {
      target: '#authorizedUser',
      content: (
        <>
          <div>
            View and add authorized users to act on your companies behalf
          </div>
        </>
      ),
    };
    const stepsData = {
      licensor: [
        {
          target: '#headerType',
          content: (
            <>
              <div className="text-lg font-custom1 text-primary">
                Click on any listing to view in further detail.
              </div>
            </>
          ),
          disableBeacon: true,
        },
        {
          target: '#dealStatusPage',
          content: (
            <>
              <div className="text-lg font-custom1 text-primary">
                This is where all of your incoming and outgoing deal proposals
                will be.
              </div>
            </>
          ),
        },
        {
          target: '#chatPage',
          content: (
            <>
              <div className="text-lg font-custom1 text-primary">
                After a deal is requested and moved to the chat room, your chats
                will appear here
              </div>
            </>
          ),
        },
        {
          target: '#settingsPage',
          content: (
            <>
              <div>Access your profile via clicking on your company logo</div>
            </>
          ),
        },
        {
          target: '#dealRequests',
          content: (
            <>
              <div>Select who can send deal requests to your brands</div>
            </>
          ),
        },
        {
          target: '#editProfile',
          content: (
            <>
              <div>Edit your profile</div>
            </>
          ),
        },
        {
          target: '#addBrand',
          content: (
            <>
              <div>Add a brand listing to appear on the explore page</div>
            </>
          ),
        },
      ],
      licensee: [
        {
          target: '#headerType',
          content: (
            <>
              <div className="text-lg font-custom1 text-primary">
                Click on any listing to view in further detail.
              </div>
            </>
          ),
          disableBeacon: true,
        },
        {
          target: '#dealStatusPage',
          content: (
            <>
              <div className="text-lg font-custom1 text-primary">
                This is where all of your incoming and outgoing deal proposals
                will be.
              </div>
            </>
          ),
        },
        {
          target: '#chatPage',
          content: (
            <>
              <div className="text-lg font-custom1 text-primary">
                After a deal is requested and moved to the chat room, your chats
                will appear here
              </div>
            </>
          ),
        },
        {
          target: '#settingsPage',
          content: (
            <>
              <div>Access your profile via clicking on your company logo</div>
            </>
          ),
        },
        {
          target: '#editProfile',
          content: (
            <>
              <div>Edit your profile</div>
            </>
          ),
        },
      ],
      agency: [
        {
          target: '#headerType',
          content: (
            <>
              <div className="text-lg font-custom1 text-primary">
                Click on any listing to view in further detail.
              </div>
            </>
          ),
          disableBeacon: true,
        },
        {
          target: '#dealStatusPage',
          content: (
            <>
              <div className="text-lg font-custom1 text-primary">
                This is where all of your incoming and outgoing deal proposals
                will be.
              </div>
            </>
          ),
        },
        {
          target: '#settingsPage',
          content: (
            <>
              <div>Access your profile via clicking on your company logo</div>
            </>
          ),
        },
        {
          target: '#editProfile',
          content: (
            <>
              <div>Edit your profile</div>
            </>
          ),
        },
        {
          target: '#viewLicensors',
          content: (
            <>
              <div>View your licensors</div>
            </>
          ),
        },
      ],
    };

    if (!isOperatingUserActive) {
      stepsData.licensor.splice(6, 0, authorizedUser);
      stepsData.licensee.splice(6, 0, authorizedUser);
      stepsData.agency.splice(5, 0, authorizedUser);
    }
    useStore.setState({
      steps: stepsData,
    });
  });

  const router: NextRouter = useRouter();
  const { t } = useTranslation();

  const handleCallbackLicensor = (data: CallBackProps) => {
    const { action, index, lifecycle, type } = data;
    if (
      action === 'skip' ||
      (type === 'tour:end' && action !== 'update') ||
      lifecycle === 'complete' ||
      action === 'close'
    ) {
      const user = {
        user_uuid: operatingUserUUID || userUUID,
        account_flag: 'tour_completed',
      };
      setAccountFlagCall(user);
      useStore.setState({ tourCompleted: true });
    }
    if (type === 'step:after' && index === 0 /* or step.target === '#home' */) {
      if (action === 'next') {
        useStore.setState({ stepIndex: 1 });
      }
    } else if (type === 'step:after' && index === 1) {
      if (action === 'next') {
        useStore.setState({ stepIndex: 2 });
      } else {
        useStore.setState({ stepIndex: 0 });
      }
    } else if (type === 'step:after' && index === 2) {
      if (action === 'next') {
        useStore.setState({ stepIndex: 3 });
      } else {
        useStore.setState({ stepIndex: 1 });
      }
    } else if (type === 'step:after' && index === 3) {
      if (action === 'next') {
        useStore.setState({ stepIndex: 4 });
        router.push(routes.settingsProfile);
        useStore.setState({ run: false });
      } else {
        useStore.setState({ stepIndex: 2 });
      }
    } else if (type === 'step:after' && index === 4) {
      if (action === 'next') {
        useStore.setState({ stepIndex: 5 });
      } else {
        useStore.setState({ stepIndex: 3 });
        router.push('/explore');
      }
    } else if (type === 'step:after' && index === 5) {
      if (action === 'next') {
        useStore.setState({ stepIndex: 6 });
      } else {
        useStore.setState({ stepIndex: 4 });
      }
    } else if (type === 'step:after' && index === 6) {
      if (action === 'next') {
        useStore.setState({ stepIndex: 7 });
      } else {
        useStore.setState({ stepIndex: 5 });
      }
    } else if (type === 'step:after' && index === 7) {
      if (action === 'next') {
        useStore.setState({ run: false });
        useStore.setState({ tourActive: false });
      } else {
        useStore.setState({ stepIndex: 6 });
      }
    } else if (action === 'reset') {
      useStore.setState({ run: false });
      useStore.setState({ stepIndex: 0 });
      useStore.setState({ tourActive: false });
    }
  };

  const handleCallbackLicensee = (data: CallBackProps) => {
    const { action, index, lifecycle, type } = data;
    if (
      action === 'skip' ||
      (type === 'tour:end' && action !== 'update') ||
      lifecycle === 'complete' ||
      action === 'close'
    ) {
      const user = {
        user_uuid: operatingUserUUID || userUUID,
        account_flag: 'tour_completed',
      };
      setAccountFlagCall(user);
      useStore.setState({ tourCompleted: true });
    }
    if (type === 'step:after' && index === 0 /* or step.target === '#home' */) {
      if (action === 'next') {
        useStore.setState({ stepIndex: 1 });
      }
    } else if (type === 'step:after' && index === 1) {
      if (action === 'next') {
        useStore.setState({ stepIndex: 2 });
      } else {
        useStore.setState({ stepIndex: 0 });
      }
    } else if (type === 'step:after' && index === 2) {
      if (action === 'next') {
        useStore.setState({ stepIndex: 3 });
      } else {
        useStore.setState({ stepIndex: 1 });
      }
    } else if (type === 'step:after' && index === 3) {
      if (action === 'next') {
        useStore.setState({ stepIndex: 4 });
        router.push(routes.settingsProfile);
        useStore.setState({ run: false });
      } else {
        useStore.setState({ stepIndex: 2 });
      }
    } else if (type === 'step:after' && index === 4) {
      if (action === 'next') {
        useStore.setState({ stepIndex: 5 });
      } else {
        useStore.setState({ stepIndex: 3 });
        router.push('/explore');
      }
    } else if (type === 'step:after' && index === 5) {
      if (action === 'next') {
        useStore.setState({ run: false });
        useStore.setState({ tourActive: false });
      } else {
        useStore.setState({ stepIndex: 4 });
      }
    } else if (action === 'reset') {
      useStore.setState({ run: false });
      useStore.setState({ stepIndex: 0 });
      useStore.setState({ tourActive: false });
    }
  };

  const handleCallbackAgency = (data: CallBackProps) => {
    const { action, index, lifecycle, type } = data;

    if (
      action === 'skip' ||
      (type === 'tour:end' && action !== 'update') ||
      lifecycle === 'complete' ||
      action === 'close'
    ) {
      const user = {
        user_uuid: operatingUserUUID || userUUID,
        account_flag: 'tour_completed',
      };
      setAccountFlagCall(user);
      useStore.setState({ tourCompleted: true });
    }
    if (type === 'step:after' && index === 0 /* or step.target === '#home' */) {
      if (action === 'next') {
        useStore.setState({ stepIndex: 1 });
      }
    } else if (type === 'step:after' && index === 1) {
      if (action === 'next') {
        useStore.setState({ stepIndex: 2 });
        useStore.setState({ run: false });
        router.push(routes.settingsProfile);
      } else {
        useStore.setState({ stepIndex: 0 });
      }
    } else if (type === 'step:after' && index === 2) {
      if (action === 'next') {
        useStore.setState({ stepIndex: 3 });
      } else {
        useStore.setState({ stepIndex: 1 });
        router.push('/explore');
      }
    } else if (type === 'step:after' && index === 3) {
      if (action === 'next') {
        useStore.setState({ stepIndex: 4 });
      } else {
        useStore.setState({ stepIndex: 2 });
      }
    } else if (type === 'step:after' && index === 4) {
      if (action === 'next') {
        useStore.setState({ stepIndex: 5 });
      } else {
        useStore.setState({ stepIndex: 3 });
      }
    } else if (type === 'step:after' && index === 5) {
      if (action === 'next') {
        useStore.setState({ run: false });
        useStore.setState({ stepIndex: 0 });
        useStore.setState({ tourActive: false });
      } else {
        useStore.setState({ stepIndex: 4 });
      }
    } else if (type === 'step:after' && action === 'prev' && index === 10) {
      useStore.setState({ run: false });
    } else if (action === 'reset' || lifecycle === 'complete') {
      useStore.setState({ run: false });
      useStore.setState({ stepIndex: 0 });
      useStore.setState({ tourActive: false });
    }
  };

  const [loaded, setLoaded] = useState<boolean>(false);
  const [showComponent, setShowComponent] = useState<boolean>(false);

  const { isLogged, token } = useAuth();

  useEffect(() => {
    if (operatingUser && primaryUser) {
      getUserCall(operatingUser).then((res: UserResponse) => {
        findUserByUuid(primaryUser).then((res2: UserByUuidResponse) => {
          useStore.setState({
            ...res2,
            userUUID: res2.uuid,
            account_flags_operating_user: res.account_flags,
            uuid_operating_user: res.uuid,
          });
          setShowFirstLoadModals(true);
        });
      });
    }
  }, [operatingUser]);

  useEffect(() => {
    if (isLogged) {
      websocket.connectSocket();
    }
    if (isLogged && userUUID) {
      getNotificationCall({ userUuid: userUUID })
        .then((res) => {
          const latestNotifications = res.filter(
            (notification) => !notification.messageStatus.read
          );
          addNotifications(latestNotifications);
        })
        .catch((err) => throwError(err));
    }
  }, [isLogged, userUUID]);

  useEffect(() => {
    if (!router.isReady) return;

    const routeToExplore = (roles: string[], uuid: string) => {
      if (router.pathname === routes.explore) return;
      if (
        !roles.includes(UserRoles.AGENCY) &&
        onlyAgent.includes(router.pathname)
      ) {
        return router.push(routes.explore);
      } else if (
        roles.includes(UserRoles.AGENCY) &&
        onlyAgent.includes(router.pathname) &&
        companyRepresented !== uuid
      ) {
        return router.push(routes.explore);
      } else if (
        roles.includes(UserRoles.AGENCY) &&
        notIfActingAgent.includes(router.pathname) &&
        (companyRepresented === uuid || !companyRepresented)
      ) {
        return router.push(routes.explore);
      }
    };

    if (isLogged && refreshUserAppWrapper && !primaryUser && accessToken) {
      getUserCall()
        .then((res: UserResponse) => {
          useStore.setState({ refreshUserAppWrapper: false });
          useStore.setState({ userUUID: res.uuid, ...res });
          if (UNPROTECTED_ROUTES.includes(router.pathname)) {
            return setLoaded(true);
          }
          if (res.account_flags.includes(AccountFlags.CUSTOMER_SERVICE)) {
            router.push('/authorize-property');
          } else if (!res.roles.length) {
            router.push(routes.onboarding);
            useStore.setState({ refreshUserAppWrapper: true });
            setShowFirstLoadModals(true);
          } else if (
            !res.account_flags.includes(AccountFlags.CUSTOMER_SERVICE) &&
            router.pathname === '/authorize-property'
          ) {
            router.push(routes.explore);
            setShowFirstLoadModals(true);
          } else {
            setShowFirstLoadModals(true);
          }
          setLoaded(true);
        })
        .catch((err) => {
          throwError(err);
          setLoaded(true);
        });
    } else if (
      isLogged &&
      refreshUserAppWrapper &&
      primaryUser &&
      accessToken
    ) {
      findUserByUuid(primaryUser)
        .then((res: UserByUuidResponse) => {
          useStore.setState({ refreshUserAppWrapper: false });
          if (UNPROTECTED_ROUTES.includes(router.pathname)) {
            return setLoaded(true);
          }
          if (res.account_flags?.includes(AccountFlags.CUSTOMER_SERVICE)) {
            router.push('/authorize-property');
          } else if (
            !res.account_flags?.includes(AccountFlags.CUSTOMER_SERVICE) &&
            router.pathname === '/authorize-property'
          ) {
            router.push('/explore');
          }
          routeToExplore(res.roles, res.uuid);
          setLoaded(true);
        })
        .catch((err) => {
          throwError(err);
          setLoaded(true);
        });
    } else if (isLogged && refreshUserAppWrapper && primaryUser) {
      findUserByUuid(primaryUser)
        .then((res: UserByUuidResponse) => {
          useStore.setState({ refreshUserAppWrapper: false });
          if (UNPROTECTED_ROUTES.includes(router.pathname)) {
            return setLoaded(true);
          } else if (
            res.account_flags?.includes(AccountFlags.CUSTOMER_SERVICE)
          ) {
            router.push('/authorize-property');
          } else if (
            !res.account_flags?.includes(AccountFlags.CUSTOMER_SERVICE) &&
            router.pathname === '/authorize-property'
          ) {
            router.push('/explore');
          }
          setLoaded(true);
        })
        .catch((error) => {
          throwError(error);
          setLoaded(true);
        });
    } else if (!accessToken && !UNPROTECTED_ROUTES.includes(router.pathname)) {
      useStore.setState({ current_page: router.asPath });
      router.push(routes.home);
    }
  }, [
    isLogged,
    token,
    router,
    refreshUserAppWrapper,
    accessToken,
    primaryUser,
    companyRepresented,
  ]);

  useEffect(() => {
    if (!router.isReady) return;
    if (UNPROTECTED_ROUTES.includes(router.pathname)) {
      if (
        unprotectedRoutesRouteIntoApp.includes(router.pathname) &&
        accessToken &&
        loaded &&
        userUUID
      ) {
        if (!logIn) {
          accountFlags.includes(AccountFlags.CUSTOMER_SERVICE)
            ? router.push('/authorize-property')
            : router.push('/explore');
        }
      } else {
        setLoaded(true);
        setShowComponent(true);
      }
    } else if (!accessToken && !userUUID && loaded) {
      if (!UNPROTECTED_ROUTES.includes(router.pathname)) {
        router.push(routes.home);
      }
      setShowComponent(true);
    } else {
      setShowComponent(true);
    }
  }, [userUUID, router, loaded, accessToken, accountFlags]);

  return !!showComponent && !!loaded ? (
    <>
      <Joyride
        callback={
          roles.includes(UserRoles.AGENCY)
            ? handleCallbackAgency
            : roles.includes(UserRoles.LICENSOR)
            ? handleCallbackLicensor
            : handleCallbackLicensee
        }
        continuous
        run={run}
        stepIndex={stepIndex}
        steps={
          roles.includes(UserRoles.AGENCY)
            ? steps.agency
            : roles.includes(UserRoles.LICENSOR)
            ? steps.licensor
            : steps.licensee
        }
        showSkipButton
        showProgress
        styles={{
          options: {
            arrowColor: '#fff',
            backgroundColor: '#fff',
            primaryColor: 'rgba(74,167,202,1)',
            textColor: '#0A0227',
            overlayColor: 'rgba(0, 0, 0, 0.5)',
            spotlightShadow: '0 0 15px rgba(74,167,202,1)',
          },
          buttonClose: {
            display: 'none',
          },
        }}
      />
      <div>{children}</div>
      {false && showFirstLoadModals && <FirstLoadModals />}
    </>
  ) : null;
};

export default AppWrapper;

export const UNPROTECTED_ROUTES: string[] = [
  routes.earlyAccess,
  routes.home,
  routes.resetPassword,
  routes.robotsTxt,
  routes.notificationSuppression,
  routes.subscribe,
];

const unprotectedRoutesRouteIntoApp: string[] = [
  routes.resetPassword,
  routes.notificationSuppression,
];

const onlyAgent: string[] = [routes.addLicensor];
const notIfActingAgent: string[] = [routes.addProduct, routes.chat];
