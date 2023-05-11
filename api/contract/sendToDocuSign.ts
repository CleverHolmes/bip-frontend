import camelcaseKeys from 'camelcase-keys';
import snakecaseKeys from 'snakecase-keys';

import * as axios from 'public/axios';
import {
  SendToDocuSignRequest,
  SendToDocuSignResponse,
} from 'models/contract/sendToDocuSign';

export const sendToDocuSignCall = async (
  data: SendToDocuSignRequest
): Promise<SendToDocuSignResponse> => {
  const res = await axios.post(`contract/sendToDocuSign`, {
    ...snakecaseKeys(data, {
      deep: true,
    }),
  });

  return camelcaseKeys(res.data, { deep: true });
};
