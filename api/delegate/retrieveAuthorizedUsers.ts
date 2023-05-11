import camelcaseKeys from 'camelcase-keys';
import snakecaseKeys from 'snakecase-keys';

import * as axios from 'public/axios';
import {
  AuthorizedUser,
  RetrieveAuthorizedUsersRequest,
} from 'models/delegate/retrieveAuthorizedUsers';

export const retrieveAuthorizedUsersCall = async (
  data: RetrieveAuthorizedUsersRequest
): Promise<AuthorizedUser[]> => {
  const res = await axios.get(`delegate/retrieveAuthorizedUsers`, {
    params: {
      ...snakecaseKeys(data, {
        deep: true,
      }),
    },
  });

  return camelcaseKeys(res.data, { deep: true });
};
