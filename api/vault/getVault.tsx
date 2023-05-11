import * as axios from 'public/axios';
import { VaultFile, VaultRequest } from 'models/vault/vault';

export const getVault = async (params: VaultRequest): Promise<VaultFile[]> => {
  const res = await axios.get(`vault`, {
    ...params,
  });
  return res.data;
};
