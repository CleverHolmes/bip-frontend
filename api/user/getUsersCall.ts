import * as axios from 'public/axios';
import { UserByUuidResponse } from 'models/user/user';

export const getUsersCall = async (
  role: string
): Promise<UserByUuidResponse[]> => {
  const res = await axios.get(`user/${role}`);
  return res.data;
};
