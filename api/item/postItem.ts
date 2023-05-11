import * as axios from 'public/axios';
import { PostItemRequest } from 'models/item/item';

// can't use response because need status code
export const postItem = async (data: PostItemRequest): Promise<any> => {
  const res = await axios.post(`item`, {
    ...data,
  });

  // can't return data, need the status code
  return res;
};
