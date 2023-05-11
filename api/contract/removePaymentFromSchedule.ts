import camelcaseKeys from 'camelcase-keys';
import snakecaseKeys from 'snakecase-keys';

import * as axios from 'public/axios';
import {
  RemovePaymentFromScheduleRequest,
  RemovePaymentFromScheduleResponse,
} from 'models/contract/payments';

export const removePaymentFomScheduleCall = async (
  data: RemovePaymentFromScheduleRequest
): Promise<RemovePaymentFromScheduleResponse> => {
  const res = await axios.post(`contract/removePaymentFromSchedule`, {
    ...snakecaseKeys(data, {
      deep: true,
    }),
  });

  return camelcaseKeys(res.data, { deep: true });
};
