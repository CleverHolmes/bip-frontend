import React, { useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { useMutation, useQuery } from '@tanstack/react-query';
import { NextRouter, useRouter } from 'next/router';

import { throwError } from 'utils/error';
import {
  notificationPreferencesKey,
  getNotificationPreferencesCall,
  postNotificationPreferencesCall,
} from 'api/messages/notificationPreferencesCall';
import { getCurrentUuid } from 'utils/getCurrentUuid';
import Toggle from 'components/Toggle';
import {
  NotificationPreference,
  PostNotificationPreferencesRequest,
} from 'models/messages/notificationPreferences';
import Button from 'components/Buttons/Button';
import routes from 'constants/routes';
import useCheckNonInteractiveUser from 'hooks/useCheckNonInteractiveUser';

const NotificationsView: React.FC = () => {
  const router: NextRouter = useRouter();

  const [notificationPreferences, setNotificationPreferences] = useState<
    NotificationPreference[]
  >([]);

  const currentUuid = getCurrentUuid(true);
  const { isNonInteractive, isPending } = useCheckNonInteractiveUser();

  const { t } = useTranslation();

  const { data, refetch } = useQuery({
    queryKey: [notificationPreferencesKey, currentUuid],
    queryFn: async () => {
      return await getNotificationPreferencesCall({ userUuid: currentUuid });
    },
    enabled: !!currentUuid && !isNonInteractive && !isPending,
    onError: (err) => {
      throwError(err);
    },
  });

  const { mutate, isLoading } = useMutation(
    async (data: PostNotificationPreferencesRequest) => {
      return await postNotificationPreferencesCall(data);
    },
    {
      onSuccess: () => {
        refetch();
      },
    }
  );

  useEffect(() => {
    if (data) setNotificationPreferences(data?.notificationPreferences);
  }, [data]);

  useEffect(() => {
    if (isNonInteractive) router.replace(routes.settingsProfile);
  }, [isNonInteractive]);

  const handleChange = (name: string, checked: boolean) => {
    setNotificationPreferences((prev) =>
      prev.map((notification) =>
        notification.notificationType === name
          ? { ...notification, enabled: checked }
          : notification
      )
    );
  };

  const handleSave = () => {
    mutate({
      userUuid: currentUuid,
      notificationPreferences,
    });
  };

  if (isNonInteractive) return null;

  return (
    <>
      <div>
        <div className="text-xl font-bold font-custom1 lg:text-3xl text-primary flex justify-between items-center">
          {t('settings.notifications')}
        </div>

        <div className="mt-6 mb-10">
          {notificationPreferences.map((notification) => (
            <div key={notification.notificationType} className="mb-2">
              <Toggle
                label={t(
                  `notificationPreferences.${notification.notificationType}`
                )}
                toggleValue={notification.notificationType}
                toggleID={notification.notificationType}
                checked={notification.enabled}
                onChange={handleChange}
              />
            </div>
          ))}
        </div>
        {!!notificationPreferences.length && (
          <Button disabled={isLoading} onClick={handleSave}>
            {t('submit')}
          </Button>
        )}
      </div>
    </>
  );
};

export default NotificationsView;
