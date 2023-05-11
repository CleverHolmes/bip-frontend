import * as axios from 'public/axios';
import { ResetPasswordResponse } from 'models/user/resetPassword';

export const getResetPasswordCall = async (
  email: string
): Promise<ResetPasswordResponse> => {
  const res = await axios.get(`user/resetPassword`, {
    params: { email },
  });
  return res.data;
};
