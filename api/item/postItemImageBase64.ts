import { ImageRequest, PostImageBase64Request } from 'models/item/image';
import * as axios from 'public/axios';

export const postItemImageBase64 = async (
  data: PostImageBase64Request
): Promise<ImageRequest> => {
  const res = await axios.post(`item/image/base64`, {
    ...data,
  });

  return res.data;
};
