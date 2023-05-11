import camelcaseKeys from 'camelcase-keys';
import snakecaseKeys from 'snakecase-keys';

import * as axios from 'public/axios';
import { UserPostRequest, UserPostResponse } from 'models/user/user';

export const postUser = async (
  data: UserPostRequest
): Promise<UserPostResponse> => {
  const res = await axios.post(`user`, {
    ...snakecaseKeys(data, {
      deep: true,
    }),
  });

  return camelcaseKeys(res.data, { deep: true });
};
