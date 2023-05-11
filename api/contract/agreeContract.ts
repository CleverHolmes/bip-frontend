import camelcaseKeys from 'camelcase-keys';
import snakecaseKeys from 'snakecase-keys';

import * as axios from 'public/axios';
import {
  AgreeContractRequest,
  AgreeContractResponse,
} from 'models/contract/agreeContract';

export const agreeContractCall = async (
  data: AgreeContractRequest
): Promise<AgreeContractResponse> => {
  const res = await axios.post(`contract/agreeContract`, {
    ...snakecaseKeys(data, {
      deep: true,
    }),
  });

  return camelcaseKeys(res.data, { deep: true });
};
