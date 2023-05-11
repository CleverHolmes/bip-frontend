import camelcaseKeys from 'camelcase-keys';
import snakecaseKeys from 'snakecase-keys';

import * as axios from 'public/axios';
import {
  UploadContractBase64Request,
  UploadContractBase64Response,
} from 'models/contract/uploadContractBase64';

export const uploadContractBase64Call = async (
  data: UploadContractBase64Request
): Promise<UploadContractBase64Response> => {
  const res = await axios.post(`contract/uploadContract/base64`, {
    ...snakecaseKeys(data, {
      deep: true,
      exclude: ['fileContentsBase64String'],
    }),
  });

  return camelcaseKeys(res.data, { deep: true });
};
