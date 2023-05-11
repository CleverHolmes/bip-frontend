import * as axios from 'public/axios';
import { DealsRequest, DealRevisionResponse } from 'models/deals/deals';

export const createDraftFromProposal = async (
  data: DealsRequest
): Promise<DealRevisionResponse> => {
  const res = await axios.post(`deal/createDraftFromProposal`, {
    ...data,
  });

  return res.data;
};
