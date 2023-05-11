import camelcaseKeys from 'camelcase-keys';
import snakecaseKeys from 'snakecase-keys';

import * as axios from 'public/axios';
import {
  CreateAuthorizedUserRequest,
  CreateAuthorizedUserResponse,
} from 'models/user/createAuthorizedUser';

export const createAuthorizedUser = async (
  data: CreateAuthorizedUserRequest
): Promise<CreateAuthorizedUserResponse> => {
  const res = await axios.post(`user/createAuthorizedUser`, {
    ...snakecaseKeys(data, {
      deep: true,
    }),
  });

  return camelcaseKeys(res.data, { deep: true });
};
