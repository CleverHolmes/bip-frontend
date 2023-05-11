import camelcaseKeys from 'camelcase-keys';
import snakecaseKeys from 'snakecase-keys';

import * as axios from 'public/axios';
import {
  ModifyAccountFlagRequest,
  ModifyAccountFlagResponse,
} from 'models/admin/modifyAccountFlag';

const url = 'admin/modifyAccountFlag';
export const modifyAccountFlagCallQueryKey = url;

export const modifyAccountFlagCall = async (
  data: ModifyAccountFlagRequest
): Promise<ModifyAccountFlagResponse> => {
  const res = await axios.post(url, {
    ...snakecaseKeys(data, {
      deep: true,
    }),
  });

  return camelcaseKeys(res.data, { deep: true });
};
