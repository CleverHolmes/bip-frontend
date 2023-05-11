import * as axios from 'public/axios';
import { DraftRequest, DealRevisionResponse } from 'models/deals/deals';

export const createDraft = async (
  data: DraftRequest
): Promise<DealRevisionResponse> => {
  const res = await axios.post(`deal/createDraft`, {
    ...data,
  });

  return res.data;
};
