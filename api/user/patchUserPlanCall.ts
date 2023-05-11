import camelcaseKeys from 'camelcase-keys';
import snakecaseKeys from 'snakecase-keys';

import * as axios from 'public/axios';
import { PatchUserPlanRequest, PatchUserPlanResponse } from 'models/user/user';

const url = 'user/plan';
export const patchUserPlanCallQueryKey = url;

export const patchUserPlanCall = async (
  data: PatchUserPlanRequest
): Promise<PatchUserPlanResponse> => {
  const res = await axios.patch(url, {
    ...snakecaseKeys(data, {
      deep: true,
    }),
  });

  return camelcaseKeys(res.data, { deep: true });
};
