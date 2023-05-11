import camelcaseKeys from 'camelcase-keys';
import snakecaseKeys from 'snakecase-keys';

import * as axios from 'public/axios';
import {
  UploadCompanyLogoRequest,
  UploadCompanyLogoResponse,
} from 'models/user/uploadCompanyLogo';

export const uploadCompanyLogo = async (
  data: UploadCompanyLogoRequest
): Promise<UploadCompanyLogoResponse> => {
  const res = await axios.post(`user/upload_company_logo/base64`, {
    ...snakecaseKeys(data, {
      deep: true,
      exclude: ['imageBase64String'],
    }),
  });

  return camelcaseKeys(res.data, { deep: true });
};
