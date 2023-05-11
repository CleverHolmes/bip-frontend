import * as axios from 'public/axios';
import { DeleteRequest } from 'models/common/deleteRequest';
import { DeleteResponse } from 'models/common/deleteResponse';

export const deleteVault = async (
  data: DeleteRequest
): Promise<DeleteResponse[]> => {
  const res = await axios.deleteRequest(`vault`, {
    ...data,
  });
  return res.data;
};
