import { DeleteDraftRequest, DeleteDraftResponse } from 'models/deals/deals';
import * as axios from 'public/axios';

export const deleteDraft = async (
  data: DeleteDraftRequest
): Promise<DeleteDraftResponse[]> => {
  const res = await axios.deleteRequest(`deal/drafts`, {
    ...data,
  });
  return res.data;
};
