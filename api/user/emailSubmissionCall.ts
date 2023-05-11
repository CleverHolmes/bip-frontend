import * as axios from 'public/axios';
import {
  EmailSubmissionRequest,
  EmailSubmissionResponse,
} from 'models/user/emailSubmission';

const url = 'user/emailSubmission';

export const emailSubmissionCall = async (
  data: EmailSubmissionRequest
): Promise<EmailSubmissionResponse> => {
  const res = await axios.post(`${url}`, {
    email: data.email,
  });
  return res.data;
};
