import snakecaseKeys from 'snakecase-keys';

import * as axios from 'public/axios';
import {
  DealsRequestAttachments,
  DealAttachmentsResponse,
} from 'models/deals/deals';

export const findDealAttachmentsByUuid = async (
  data: DealsRequestAttachments
): Promise<DealAttachmentsResponse[]> => {
  const res = await axios.post(`deal/findDealAttachmentsByUuid`, {
    ...snakecaseKeys(data, {
      deep: true,
    }),
  });

  return res.data;
};
