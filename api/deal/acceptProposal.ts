import * as axios from 'public/axios';
import { DealsRequest, AcceptedResponse } from 'models/deals/deals';

export const acceptProposal = async (
  data: DealsRequest
): Promise<AcceptedResponse> => {
  const res = await axios.post(`deal/acceptProposal`, {
    ...data,
  });

  return res.data;
};
