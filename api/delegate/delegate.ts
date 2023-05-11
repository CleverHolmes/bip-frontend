import { Delegate, DelegateRequest } from 'models/delegate/delegate';
import * as axios from 'public/axios';

const url = 'delegate';
export const delegateQueryKey = url;

export const delegate = async (
  params: DelegateRequest
): Promise<Delegate[]> => {
  const res = await axios.get(`delegate`, {
    ...params,
  });
  return res.data;
};
