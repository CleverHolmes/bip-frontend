import * as axios from 'public/axios';
import { ItemByUUIDResponse, FindItemsRequest } from 'models/item/item';

const url = 'item/findItems';
export const findItemsQueryKey = url;
export const findItems = async (
  params: FindItemsRequest
): Promise<ItemByUUIDResponse[]> => {
  const res = await axios.get(url, {
    ...params,
  });
  return res.data;
};
