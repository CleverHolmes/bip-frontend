import * as axios from 'public/axios';
import { DealsRequest, RejectedResponse } from 'models/deals/deals';

export const rejectProposal = async (
  data: DealsRequest
): Promise<RejectedResponse> => {
  const res = await axios.post(`deal/rejectProposal`, {
    ...data,
  });

  return res.data;
};
