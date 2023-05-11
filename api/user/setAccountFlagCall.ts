import * as axios from 'public/axios';
import {
  SetAccountFlagRequest,
  SetAccountFlagResponse,
} from 'models/user/user';

export const setAccountFlagCall = async (
  data: SetAccountFlagRequest
): Promise<SetAccountFlagResponse> => {
  const res = await axios.patch(`user/setAccountFlag`, {
    ...data,
  });
  return res.data;
};
