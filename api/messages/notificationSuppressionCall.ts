import camelcaseKeys from 'camelcase-keys';
import snakecaseKeys from 'snakecase-keys';

import * as axios from 'public/axios';
import {
  NotificationSuppressionRequest,
  NotificationSuppressionResponse,
} from 'models/messages/notificationSuppression';

export const notificationSuppressionCall = async (
  data: NotificationSuppressionRequest
): Promise<NotificationSuppressionResponse> => {
  const res = await axios.post(`message/notificationSuppression`, {
    ...snakecaseKeys(data, {
      deep: true,
    }),
  });

  return camelcaseKeys(res.data, { deep: true });
};
