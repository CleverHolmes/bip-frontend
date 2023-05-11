import * as axios from 'public/axios';
import { UserRequest, CreateUuidResponse } from 'models/user/user';

export const createUuid = async (
  data: UserRequest
): Promise<CreateUuidResponse> => {
  const res = await axios.post(`item/createUuid`, {
    ...data,
  });

  return res.data;
};
