import React, { useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'next-i18next';
import { NextRouter, useRouter } from 'next/router';
import Image from 'next/image';

import routes from 'constants/routes';
import { NotificationSuppressionRequest } from 'models/messages/notificationSuppression';
import { notificationSuppressionCall } from 'api/messages/notificationSuppressionCall';
import CircleLoaderSpinner from 'components/CircleLoaderSpinner';

const NotificationSuppressionView: React.FC = () => {
  const { t } = useTranslation();
  const router: NextRouter = useRouter();
  const {
    query: { user_uuid, deal_uuid, token },
  } = router;

  const { mutate, isLoading, isIdle, isError } = useMutation(
    async (data: NotificationSuppressionRequest) => {
      return await notificationSuppressionCall(data);
    },
    {
      onError: () => {
        router.replace(routes.explore);
      },
    }
  );

  useEffect(() => {
    if (user_uuid && deal_uuid && token) {
      mutate({
        userUuid: user_uuid as string,
        dealUuid: deal_uuid as string,
        token: token as string,
      });
    } else {
      router.replace(routes.explore);
    }
  }, [user_uuid, deal_uuid, token]);

  return (
    <div className="flex flex-col items-center">
      <div className="fixed bottom-0 right-0 overflow-hidden pointer-events-none">
        <Image
          src="/images/BackgroundBlur.svg"
          alt="background-blur"
          width={1353}
          height={524}
          objectPosition="right bottom"
          layout="fixed"
        />
      </div>
      {!isLoading && !isIdle && !isError && (
        <>
          <div className="px-4 py-6 mt-20 mr-5 text-3xl font-bold text-primary lg:text-5xl font-custom1">
            {t('notificationSuppression.title')}
          </div>
          <div className="px-4 py-2 mb-20 mr-5 text-lg text-primary font-custom1">
            {t('notificationSuppression.success')}
          </div>
          <button
            onClick={() => {
              router.replace(routes.explore);
            }}
            className={
              'bg-button rounded-full text-white flex justify-center items-center cursor-pointer hover:bg-buttonHover2 hover:shadow-lg focus:bg-buttonHover2 focus:shadow-lg focus:outline-none focus:ring focus:ring-button/50 active:bg-buttonHover2 active:shadow-lg transition duration-150 ease-in-out py-3.5 w-72 font-bold font-custom1 text-xl mt-2'
            }
          >
            {t('go-home-button')}
          </button>
        </>
      )}
      {(isLoading || isIdle || isError) && <CircleLoaderSpinner size={500} />}
    </div>
  );
};

export default NotificationSuppressionView;
