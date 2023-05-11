import camelcaseKeys from 'camelcase-keys';
import snakecaseKeys from 'snakecase-keys';

import * as axios from 'public/axios';
import {
  UpdateStatusesRequest,
  UpdateStatusesResponse,
} from 'models/messages/updateStatuses';

export const updateStatuses = async (
  data: UpdateStatusesRequest
): Promise<UpdateStatusesResponse> => {
  const res = await axios.patch(`message/statuses`, {
    ...snakecaseKeys(data, {
      deep: true,
    }),
  });

  return camelcaseKeys(res.data, { deep: true });
};
