import * as axios from 'public/axios';
import {
  PostChangePasswordRequest,
  PostChangePasswordResponse,
} from 'models/user/changePassword';

export const postChangePasswordCall = async (
  data: PostChangePasswordRequest
): Promise<PostChangePasswordResponse> => {
  const res = await axios.post(`user/changePassword`, {
    ...data,
  });
  return res.data;
};
