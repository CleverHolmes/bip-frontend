import camelcaseKeys from 'camelcase-keys';
import snakecaseKeys from 'snakecase-keys';

import * as axios from 'public/axios';
import {
  AddToPaymentScheduleRequest,
  AddToPaymentScheduleResponse,
} from 'models/contract/payments';

export const addPaymentToScheduleCall = async (
  data: AddToPaymentScheduleRequest
): Promise<AddToPaymentScheduleResponse> => {
  const res = await axios.post(`contract/addPaymentToSchedule`, {
    ...snakecaseKeys(data, {
      deep: true,
    }),
  });

  return camelcaseKeys(res.data, { deep: true });
};
