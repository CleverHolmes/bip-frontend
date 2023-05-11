import * as axios from 'public/axios';
import { ItemByUUIDResponse } from 'models/item/item';

export const findItemByUuid = async (
  uuid: string
): Promise<ItemByUUIDResponse> => {
  const res = await axios.get(`item/findItemByUuid/${uuid}`);
  return res.data;
};
