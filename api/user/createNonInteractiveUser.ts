import camelcaseKeys from 'camelcase-keys';
import snakecaseKeys from 'snakecase-keys';

import * as axios from 'public/axios';
import {
  CreateNonInteractiveUserRequest,
  CreateNonInteractiveUserResponse,
} from 'models/user/createNonInteractiveUser';

export const createNonInteractiveUser = async (
  data: CreateNonInteractiveUserRequest
): Promise<CreateNonInteractiveUserResponse> => {
  const res = await axios.post(`user/createNonInteractiveUser`, {
    ...snakecaseKeys(data, {
      deep: true,
      exclude: ['fileContentsBase64String'],
    }),
  });

  return camelcaseKeys(res.data, { deep: true });
};
