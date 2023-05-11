import camelcaseKeys from 'camelcase-keys';
import snakecaseKeys from 'snakecase-keys';

import * as axios from 'public/axios';
import {
  UploadFileAttachmentBase64Request,
  UploadFileAttachmentBase64Response,
} from 'models/messages/uploadFileAttachmentBase64';

export const uploadFileAttachmentBase64 = async (
  data: UploadFileAttachmentBase64Request
): Promise<UploadFileAttachmentBase64Response> => {
  const res = await axios.post(`message/uploadFileAttachment/base64`, {
    ...snakecaseKeys(data, {
      deep: true,
      exclude: ['fileContentsBase64String'],
    }),
  });

  return camelcaseKeys(res.data, { deep: true });
};
