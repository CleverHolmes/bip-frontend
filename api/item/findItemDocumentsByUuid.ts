import * as axios from 'public/axios';
import { ItemDocumentsByUuidResponse } from 'models/item/item';

export const findItemDocumentsByUuidCall = async (
  uuid: string
): Promise<ItemDocumentsByUuidResponse> => {
  const res = await axios.get(`item/findItemDocumentsByUuid/${uuid}`);
  return res.data;
};
