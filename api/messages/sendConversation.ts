import * as axios from 'public/axios';
import {
  SendConversationResponse,
  SendConversationRequest,
} from 'models/messages/sendConversation';

export const sendConversation = async (
  data: SendConversationRequest
): Promise<SendConversationResponse> => {
  const res = await axios.post(`message/conversation`, {
    ...data,
  });

  return res.data;
};
