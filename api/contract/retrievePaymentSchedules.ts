import camelcaseKeys from 'camelcase-keys';
import snakecaseKeys from 'snakecase-keys';

import * as axios from 'public/axios';
import {
  RetrievePaymentSchedulesRequest,
  RetrievePaymentSchedulesResponse,
} from 'models/contract/payments';

const url = 'contract/retrievePaymentSchedules';
export const retrievePaymentSchedulesQueryKey = url;
export const retrievePaymentSchedulesCall = async (
  data: RetrievePaymentSchedulesRequest
): Promise<RetrievePaymentSchedulesResponse> => {
  const res = await axios.post(url, {
    ...snakecaseKeys(data, {
      deep: true,
    }),
  });

  return camelcaseKeys(res.data, { deep: true });
};
