import * as axios from 'public/axios';
import {
  ValidateEmailRequest,
  ValidateEmailResponse,
} from 'models/user/validateEmail';

const url = 'user/validateEmail';

export const validateEmail = async (
  data: ValidateEmailRequest
): Promise<ValidateEmailResponse> => {
  const res = await axios.get(`${url}`, {
    params: {
      email: data.email,
    },
  });
  return res.data;
};
