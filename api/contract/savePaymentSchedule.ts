import camelcaseKeys from 'camelcase-keys';
import snakecaseKeys from 'snakecase-keys';

import * as axios from 'public/axios';
import {
  SavePaymentScheduleRequest,
  SavePaymentScheduleResponse,
} from 'models/contract/payments';

export const savePaymentScheduleCall = async (
  data: SavePaymentScheduleRequest
): Promise<SavePaymentScheduleResponse> => {
  const res = await axios.post(`contract/savePaymentSchedule`, {
    ...snakecaseKeys(data, {
      deep: true,
    }),
  });

  return camelcaseKeys(res.data, { deep: true });
};
