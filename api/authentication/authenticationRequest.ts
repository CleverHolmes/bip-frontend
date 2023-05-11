import * as axios from 'public/axios';
import {
  AuthententicationResponse,
  AuthenticationRequest,
} from 'models/authentication/authentication';

export const authenticationRequest = async (
  data: AuthenticationRequest
): Promise<AuthententicationResponse> => {
  const res = await axios.post(`authentication/authenticationRequest`, {
    ...data,
  });

  return res.data;
};
