import snakecaseKeys from 'snakecase-keys';

import * as axios from 'public/axios';
import { DealsRequest, DealResponse } from 'models/deals/deals';

const url = 'deal/retrieveDeals';
export const retrieveDealsQueryKey = url;
export const retrieveDeals = async (
  data: DealsRequest
): Promise<DealResponse[]> => {
  const res = await axios.post(url, {
    ...snakecaseKeys(data, {
      deep: true,
    }),
  });
  const newData: DealResponse[] = res.data.map((item: DealResponse) => {
    const contractTabData = JSON.parse(item.contract_tab_data as string);
    return {
      ...item,
      contract_tab_data: Array.isArray(contractTabData) ? contractTabData : [],
    };
  });

  return newData;
};
