import camelcaseKeys from 'camelcase-keys';
import snakecaseKeys from 'snakecase-keys';

import * as axios from 'public/axios';
import {
  RemoveAuthorizedUserRequest,
  RemoveAuthorizedUserResponse,
} from 'models/user/removeAuthorizedUser';

export const removeAuthorizedUserCall = async (
  data: RemoveAuthorizedUserRequest
): Promise<RemoveAuthorizedUserResponse> => {
  const res = await axios.post(`user/removeAuthorizedUser`, {
    ...snakecaseKeys(data, {
      deep: true,
    }),
  });

  return camelcaseKeys(res.data, { deep: true });
};
