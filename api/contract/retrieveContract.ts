import camelcaseKeys from 'camelcase-keys';
import snakecaseKeys from 'snakecase-keys';

import * as axios from 'public/axios';
import {
  RetrieveContractRequest,
  RetrieveContractResponse,
} from 'models/contract/retrieveContract';

export const retrieveContractCall = async (
  data: RetrieveContractRequest
): Promise<RetrieveContractResponse> => {
  const res = await axios.post(`contract/retrieveContract`, {
    ...snakecaseKeys(data, {
      deep: true,
    }),
  });

  return camelcaseKeys(res.data, { deep: true });
};
