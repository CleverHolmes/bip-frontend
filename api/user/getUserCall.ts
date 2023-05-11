import * as axios from 'public/axios';
import { UserResponse } from 'models/user/user';

const url = 'user';
export const getUserQueryKey = url;

export const getUserCall = async (
  user_uuid?: string
): Promise<UserResponse> => {
  const res = user_uuid
    ? await axios.get(url, {
        params: { user_uuid },
      })
    : await axios.get(`user/`);
  return res.data;
};
