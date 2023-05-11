import camelcaseKeys from 'camelcase-keys';
import snakecaseKeys from 'snakecase-keys';

import * as axios from 'public/axios';
import {
  GetNotificationPreferencesRequest,
  GetNotificationPreferencesResponse,
  PostNotificationPreferencesRequest,
  PostNotificationPreferencesResponse,
} from 'models/messages/notificationPreferences';

const url = 'message/notificationPreferences';
export const notificationPreferencesKey = url;

export const getNotificationPreferencesCall = async (
  data: GetNotificationPreferencesRequest
): Promise<GetNotificationPreferencesResponse> => {
  const res = await axios.get(url, {
    params: {
      ...snakecaseKeys(data, {
        deep: true,
      }),
    },
  });

  return camelcaseKeys(res.data, { deep: true });
};

export const postNotificationPreferencesCall = async (
  data: PostNotificationPreferencesRequest
): Promise<PostNotificationPreferencesResponse> => {
  const res = await axios.post(url, {
    ...snakecaseKeys(data, {
      deep: true,
      exclude: ['notificationType'],
    }),
  });

  return camelcaseKeys(res.data, { deep: true });
};
