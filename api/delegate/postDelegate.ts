import { PostDelegate } from 'models/delegate/delegate';
import * as axios from 'public/axios';

export const postDelegate = async (
  params: PostDelegate
): Promise<PostDelegate> => {
  const res = await axios.post(`delegate`, {
    ...params,
  });
  return res.data;
};
