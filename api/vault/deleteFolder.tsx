import * as axios from 'public/axios';
import { DeleteResponse } from 'models/common/deleteResponse';
import { DeleteFolderRequest } from 'models/vault/vault';

export const deleteFolder = async (
  data: DeleteFolderRequest
): Promise<DeleteResponse[]> => {
  const res = await axios.deleteRequest(`vault/folder`, {
    ...data,
  });
  return res.data;
};
