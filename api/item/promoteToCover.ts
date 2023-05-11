import * as axios from 'public/axios';
import { ImageRequestCover, ImageRequest } from 'models/item/image';

export const promoteToCover = async (
  data: ImageRequestCover
): Promise<ImageRequest> => {
  const res = await axios.post(`item/image/promoteToCover`, {
    ...data,
  });

  return res.data;
};
