import camelcaseKeys from 'camelcase-keys';
import snakecaseKeys from 'snakecase-keys';

import * as axios from 'public/axios';
import {
  ConversationRequest,
  ConversationResponse,
} from 'models/messages/conversation';

export const getConversation = async (
  data: ConversationRequest
): Promise<ConversationResponse> => {
  const res = await axios.get(`message/conversation`, {
    params: {
      ...snakecaseKeys(data, {
        deep: true,
      }),
    },
  });

  return camelcaseKeys(res.data, { deep: true });
};
