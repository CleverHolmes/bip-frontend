import { DelegateRequest } from 'models/admin/delegate';
import * as axios from 'public/axios';

export const delegate = async (
  data: DelegateRequest
): Promise<DelegateRequest> => {
  const res = await axios.post(`delegate`, {
    ...data,
  });
  return res.data;
};
