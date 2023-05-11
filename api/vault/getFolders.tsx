import * as axios from 'public/axios';
import { VaultFolder, VaultRequest } from 'models/vault/vault';

export const getFolders = async (
  params: VaultRequest
): Promise<VaultFolder> => {
  const res = await axios.get(`vault/getFolders`, {
    ...params,
  });
  return res.data;
};
