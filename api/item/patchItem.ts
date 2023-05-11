import * as axios from 'public/axios';
import { PatchItemRequest } from 'models/item/item';

// can't use - PatchItemResponse - because need status code
export const patchItem = async (data: PatchItemRequest): Promise<any> => {
  const res = await axios.patch(`item`, {
    ...data,
  });

  // can't return data, need the status code
  return res;
};
