import * as axios from 'public/axios';
import {
  UploadFileAttachmentBase64Request,
  UploadFileAttachmentBase64Response,
} from 'models/deals/deals';

export const uploadFileAttachment = async (
  data: UploadFileAttachmentBase64Request
): Promise<UploadFileAttachmentBase64Response> => {
  const res = await axios.post(`deal/uploadFileAttachment/base64`, {
    ...data,
  });

  return res.data;
};
