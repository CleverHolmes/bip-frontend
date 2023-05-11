import React from 'react';
import dayjs from 'dayjs';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';

import useStore from 'modules/Store';
import routes from 'constants/routes';
import { updateStatuses } from 'api/messages/updateStatuses';

const NotificationCenter: React.FC = () => {
  const { t } = useTranslation();
  const notifications = useStore((state) => state.notifications);
  const updateNotificationStatus = useStore(
    (state) => state.updateNotificationStatus
  );
  const userUUID = useStore((state) => state.userUUID);
  const operatingUserUUID = useStore((state) => state.uuid_operating_user);

  const markAllAsRead = () => {
    notifications.map((notification) => {
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
      <div className="flex flex-col leading-normal max-h-[40rem] bg-backgroundInput rounded-lg drop-shadow-lg min-w-full px-4 py-4 overflow-scroll">
        {notifications.length === 0 && (
          <div className="overflow-x-auto max-h-[40rem] bg-white rounded-lg drop-shadow-lg min-w-full px-4 py-4">
            <div className="py-8 text-lg font-normal text-left text-inputGray font-custom1">
              {t('dashboard.no-notifications')}
            </div>
          </div>
        )}
        <div>
          {notifications.length > 0 && (
            <div
              className="p-4 text-base rounded-lg cursor-pointer text-inputGray font-custom1 bg-backgroundInput hover:text-button"
              onClick={markAllAsRead}
            >
              {t('mark-all-as-read')}
            </div>
          )}
          {notifications
            .sort((a, b) => {
              return (
                new Date(a.createdAt).getTime() -
                new Date(b.createdAt).getTime()
              );
            })
            .reverse()
            .map((notification) => {
              return (
                <Link
                  key={notification.uuid}
                  href={notification.uriTarget || routes.dashboard}
                >
                  <a
                    onClick={() => {
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
                    }}
                  >
                    <div
                      className={`flex flex-col items-start text-base font-custom2 p-2 -m-1  rounded-lg  text-inputGray  px-3 2xl:px-3.5 my-1 border-2 border-backgroundInput bg-white hover:bg-backgroundInput cursor-pointer
                        `}
                    >
                      <div className="relative text-lg font-bold text-primary font-custom1">
                        {notification.message}
                        {!notification.messageStatus.read && (
                          <div className="absolute w-3 h-3 border-2 border-white rounded-full bg-redButton -right-4 -top-1" />
                        )}
                      </div>
                      <div className="text-sm text-inputGray font-custom2">
                        {dayjs(notification.createdAt).format('MMM DD - h:mmA')}
                        {' - '}
                        {dayjs(notification.createdAt).fromNow()}
                      </div>
                    </div>
                  </a>
                </Link>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default NotificationCenter;
