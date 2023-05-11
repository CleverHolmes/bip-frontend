import * as axios from 'public/axios';
import { ImageRequest } from 'models/item/image';

export const deleteImage = async (
  data: ImageRequest
): Promise<ImageRequest[]> => {
  const res = await axios.deleteRequest(`item/image`, {
    ...data,
  });
  return res.data;
};
