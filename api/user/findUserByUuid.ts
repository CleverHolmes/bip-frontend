import * as axios from 'public/axios';
import { UserByUuidResponse } from 'models/user/user';

const url = 'user/findUserByUuid';
export const findUserByUuidQueryKey = url;

export const findUserByUuid = async (
  uuid: string
): Promise<UserByUuidResponse> => {
  const res = await axios.get(`${url}/${uuid}`);
  return res.data;
};
