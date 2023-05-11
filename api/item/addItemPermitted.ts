import * as axios from 'public/axios';
import {
  AddItemPermittedRequest,
  AddItemPermittedResponse,
} from 'models/item/item';

export const addItemPermitted = async (
  params: AddItemPermittedRequest
): Promise<AddItemPermittedResponse[]> => {
  const res = await axios.post(`item/addItemPermitted`, {
    ...params,
  });
  return res.data;
};
