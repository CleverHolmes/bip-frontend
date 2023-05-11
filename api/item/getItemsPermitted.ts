import * as axios from 'public/axios';
import {
  ItemsPermittedResponse,
  ItemsPermittedRequest,
} from 'models/item/item';

export const getItemsPermitted = async (
  params: ItemsPermittedRequest
): Promise<ItemsPermittedResponse[]> => {
  const res = await axios.get(`item/getItemsPermitted`, {
    ...params,
  });
  return res.data;
};
