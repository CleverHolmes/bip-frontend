import * as axios from 'public/axios';
import {
  PasswordPostRequest,
  PasswordPostResponse,
} from 'models/user/resetPassword';

export const postResetPasswordCall = async (
  data: PasswordPostRequest
): Promise<PasswordPostResponse> => {
  const res = await axios.post(`user/resetPassword`, {
    ...data,
  });
  return res.data;
};
