import camelcaseKeys from 'camelcase-keys';
import snakecaseKeys from 'snakecase-keys';

import * as axios from 'public/axios';
import {
  DueDiligenceQuestionnaireRequest,
  DueDiligenceQuestionnaireResponse,
} from 'models/user/dueDiligenceQuestionnaire';

const url = 'user/dueDiligenceQuestionnaire';
export const dueDiligenceQuestionnaireQueryKey = url;

export const dueDiligenceQuestionnaireCall = async (
  data: DueDiligenceQuestionnaireRequest
): Promise<DueDiligenceQuestionnaireResponse> => {
  const res = await axios.post(url, {
    ...snakecaseKeys(data, {
      deep: true,
    }),
  });

  return camelcaseKeys(res.data, { deep: true });
};
