import * as axios from 'public/axios';
import { DeleteRequest } from 'models/common/deleteRequest';
import { DeleteResponse } from 'models/common/deleteResponse';

export const deleteFileAttachment = async (
  data: DeleteRequest
): Promise<DeleteResponse[]> => {
  const res = await axios.deleteRequest(`deal/fileAttachment`, {
    ...data,
  });
  return res.data;
};
