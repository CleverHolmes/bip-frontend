import camelcaseKeys from 'camelcase-keys';
import snakecaseKeys from 'snakecase-keys';

import * as axios from 'public/axios';
import {
  SaveContractTabDataRequest,
  SaveContractTabDataResponse,
} from 'models/contract/saveContractTabData';

export const saveContractTabDataCall = async (
  data: SaveContractTabDataRequest
): Promise<SaveContractTabDataResponse> => {
  const res = await axios.post(`contract/saveContractTabData`, {
    ...snakecaseKeys(data, {
      deep: true,
    }),
  });

  return camelcaseKeys(res.data, { deep: true });
};
