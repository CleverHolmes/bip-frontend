import camelcaseKeys from 'camelcase-keys';
import snakecaseKeys from 'snakecase-keys';

import * as axios from 'public/axios';
import { MessageRequest, MessageResponse } from 'models/messages/message';

export const getNotificationCall = async (
  data: MessageRequest
): Promise<MessageResponse[]> => {
  const res = await axios.get(`message/notification`, {
    params: {
      ...snakecaseKeys(data, {
        deep: true,
      }),
    },
  });

  return camelcaseKeys(res.data, { deep: true });
};
