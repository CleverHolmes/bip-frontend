import { UserPropertyRequest, UserPropertyResponse } from 'models/user/user';
import * as axios from 'public/axios';

export const postUserPropertyListFileBase64Call = async (
  data: UserPropertyRequest
): Promise<UserPropertyResponse> => {
  const res = await axios.post(`user/property_list_file/base64`, {
    ...data,
  });

  return res.data;
};
