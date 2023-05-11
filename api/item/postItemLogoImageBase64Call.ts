import { ImageRequest, PostImageBase64Request } from 'models/item/image';
import * as axios from 'public/axios';

export const postItemLogoImageBase64Call = async (
  data: PostImageBase64Request
): Promise<ImageRequest> => {
  const res = await axios.post(`item/logoImage/base64`, {
    ...data,
  });

  return res.data;
};
