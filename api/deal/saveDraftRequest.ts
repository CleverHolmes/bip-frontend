import * as axios from 'public/axios';
import { DraftRequest, DraftResponse } from 'models/deals/deals';

export const saveDraftRequest = async (
  data: DraftRequest
): Promise<DraftResponse> => {
  const res = await axios.post(`deal/saveDraft`, {
    ...data,
  });

  return res.data;
};
