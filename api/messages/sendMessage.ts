import camelcaseKeys from 'camelcase-keys';
import snakecaseKeys from 'snakecase-keys';

import * as axios from 'public/axios';
import {
  SendMessageRequest,
  SendMessageResponse,
} from 'models/messages/sendMessage';

export const sendMessageCall = async (
  data: SendMessageRequest
): Promise<SendMessageResponse> => {
  const res = await axios.post('message', {
    ...snakecaseKeys(data, {
      deep: true,
    }),
  });

  return camelcaseKeys(res.data, { deep: true });
};
