import * as axios from 'public/axios';
import { ItemImagesByUuidResponse } from 'models/item/item';

export const findItemImagesByUuid = async (
  uuid: string
): Promise<ItemImagesByUuidResponse> => {
  const res = await axios.get(`item/findItemImagesByUuid/${uuid}`);
  return res.data;
};
