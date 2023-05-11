import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';
import classnames from 'classnames';

import { throwError } from 'utils/error';
import { UserByUuidResponse } from 'models/user/user';
import { findUserByUuid } from 'api/user/findUserByUuid';
import Tab from 'components/new/Tab';
import ImportantDates from './components/ImportantDates';
import NotificationCenter from './components/NotificationCenter';
import useStore from 'modules/Store';
import useTokensOrCookies from 'contexts/TokensOrCookies';

const DashboardView: React.FC = () => {
  const [company, setCompany] = useState<UserByUuidResponse>();
  const { t } = useTranslation();

  const notifications = useStore((state) => state.notifications);

  const { accessToken, companyRepresented, operatingUser } =
    useTokensOrCookies();

  const tabs = [
    {
      title: 'dashboard.important-dates',
      showUnreadAmount: false,
      unreadAmount: 0,
    },
    {
      title: 'dashboard.notification-center',
      showUnreadAmount: true,
      unreadAmount: notifications.filter(
        (notification) => !notification.messageStatus.read
      ).length,
    },
  ];

  useEffect(() => {
    if (accessToken && companyRepresented) {
      findUserByUuid(companyRepresented)
        .then((res) => {
          setCompany(res);
        })
        .catch((err) => throwError(err));
    }
  }, [accessToken, companyRepresented]);

  return (
    <>
      <div className="fixed bottom-0 right-0 z-[-1] overflow-hidden pointer-events-none">
        <Image
          src="/images/BackgroundBlur.svg"
          alt="background-blur"
          width={1353}
          height={524}
          objectPosition="right bottom"
          layout="fixed"
          priority
        />
      </div>
      <div className="mb-6 text-3xl font-bold font-custom1 text-primary lg:mb-8">
        {company && company.company_name} Dashboard
      </div>
      <div className="mt-6">
        <Tab.Group>
          <Tab.List className={classnames('w-full lg:w-3/5')}>
            {tabs.map(
              (tab) =>
                (!operatingUser ||
                  tab.title !== 'dashboard.payment-center') && (
                  <Tab
                    key={tab.title}
                    showUnreadAmount={tab.showUnreadAmount}
                    unreadAmount={tab.unreadAmount}
                  >
                    {t(tab.title)}
                  </Tab>
                )
            )}
          </Tab.List>
          <Tab.Panels>
            <Tab.Panel unmount={false}>
              <ImportantDates />
            </Tab.Panel>
            <Tab.Panel unmount={false}>
              <NotificationCenter />
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </>
  );
};

export default DashboardView;
