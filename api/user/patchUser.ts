import * as axios from 'public/axios';
import { UserPostRequest, UserPatchResponse } from 'models/user/user';

export const patchUser = async (
  data: UserPostRequest
  // ): Promise<UserPatchResponse> => {
): Promise<any> => {
  const res = await axios.patch(`user`, {
    ...data,
  });

  // can't return data, need the status code
  return res;
};
