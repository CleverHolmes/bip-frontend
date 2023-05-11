import camelcaseKeys from 'camelcase-keys';
import snakecaseKeys from 'snakecase-keys';

import * as axios from 'public/axios';
import {
  RequestURIRequest,
  RequestURIResponse,
} from 'models/tipalti/requestURI';

const url = 'tipalti/requestURISetupProcess';
export const requestURISetupProcessQueryKey = url;

export const requestURISetupProcessCall = async (
  data: RequestURIRequest
): Promise<RequestURIResponse> => {
  const res = await axios.post(url, {
    ...snakecaseKeys(data, {
      deep: true,
    }),
  });

  return camelcaseKeys(res.data, { deep: true });
};
