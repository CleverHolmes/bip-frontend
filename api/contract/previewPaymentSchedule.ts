import camelcaseKeys from 'camelcase-keys';
import snakecaseKeys from 'snakecase-keys';

import * as axios from 'public/axios';
import {
  PreviewPaymentScheduleRequest,
  PreviewPaymentScheduleResponse,
} from 'models/contract/payments';

export const previewPaymentScheduleCall = async (
  data: PreviewPaymentScheduleRequest
): Promise<PreviewPaymentScheduleResponse> => {
  const res = await axios.post(`contract/previewPaymentSchedule`, {
    ...snakecaseKeys(data, {
      deep: true,
    }),
  });

  return camelcaseKeys(res.data, { deep: true });
};
