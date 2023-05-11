import camelcaseKeys from 'camelcase-keys';
import snakecaseKeys from 'snakecase-keys';

import * as axios from 'public/axios';
import {
  RetrievePaymentScheduleRequest,
  RetrievePaymentScheduleResponse,
} from 'models/contract/payments';

export const retrievePaymentScheduleCall = async (
  data: RetrievePaymentScheduleRequest
): Promise<RetrievePaymentScheduleResponse> => {
  const res = await axios.post(`contract/retrievePaymentSchedule`, {
    ...snakecaseKeys(data, {
      deep: true,
    }),
  });

  return camelcaseKeys(res.data, { deep: true });
};
