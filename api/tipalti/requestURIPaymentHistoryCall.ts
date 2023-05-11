import camelcaseKeys from 'camelcase-keys';
import snakecaseKeys from 'snakecase-keys';

import * as axios from 'public/axios';
import {
  RequestURIRequest,
  RequestURIResponse,
} from 'models/tipalti/requestURI';

const url = 'tipalti/requestURIPaymentHistory';
export const requestURIPaymentHistoryQueryKey = url;
export const requestURIPaymentHistoryCall = async (
  data: RequestURIRequest
): Promise<RequestURIResponse> => {
  const res = await axios.post(`tipalti/requestURIPaymentHistory`, {
    ...snakecaseKeys(data, {
      deep: true,
    }),
  });

  return camelcaseKeys(res.data, { deep: true });
};
