import * as axios from 'public/axios';
import { DealsRequest, DraftProposalSentResponse } from 'models/deals/deals';

export const sendDraftAsProposal = async (
  data: DealsRequest
): Promise<DraftProposalSentResponse> => {
  const res = await axios.post(`deal/sendDraftAsProposal`, {
    ...data,
  });

  return res.data;
};
