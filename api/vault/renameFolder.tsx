import * as axios from 'public/axios';
import { RenameFolderRequest, RenameFolderResponse } from 'models/vault/vault';

export const renameFolder = async (
  data: RenameFolderRequest
): Promise<RenameFolderResponse> => {
  const res = await axios.patch(`vault/renameFolder`, {
    ...data,
  });
  return res.data;
};
