import * as axios from 'public/axios';
import { ImageRequest } from 'models/item/image';

export const deleteDocumentCall = async (
  data: ImageRequest
): Promise<ImageRequest[]> => {
  const res = await axios.deleteRequest(`item/document`, {
    ...data,
  });
  return res.data;
};
