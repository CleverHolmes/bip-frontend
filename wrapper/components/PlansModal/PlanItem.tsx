import React from 'react';
import { useTranslation } from 'next-i18next';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { PlanType } from './plans';
import Button from 'components/Buttons/Button';
import useStore from 'modules/Store';
import { patchUserPlanCall } from 'api/user/patchUserPlanCall';
import { PatchUserPlanRequest } from 'models/user/user';
import { getCurrentUuid } from 'utils/getCurrentUuid';
import { getUserQueryKey } from 'api/user/getUserCall';
import { delegateQueryKey } from 'api/delegate/delegate';

interface Props {
  plan: PlanType;
  isSelf?: boolean;
  onFinish: () => void;
}

const PlanItem: React.FC<Props> = ({ plan, isSelf = false, onFinish }) => {
  const { t } = useTranslation();
  const currentUserUuid = getCurrentUuid();
  const queryClient = useQueryClient();

  const { isLoading: isUpdatingUser, mutate: updateUserPlan } = useMutation(
    async (data: PatchUserPlanRequest) => {
      return await patchUserPlanCall(data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [getUserQueryKey, delegateQueryKey],
        });
        useStore.setState({ refreshUserAppWrapper: true });
        onFinish();
      },
    }
  );

  const handleGetStartedClick = () => {
    updateUserPlan({
      userUuid: currentUserUuid,
      plan: plan.name,
    });
  };

  return (
    <div className="shadow-md p-2 rounded-xl">
      <div
        className={`flex justify-center items-center text-center h-[80px] text-white text-2xl font-bold rounded-xl bg-gradient-to-br ${
          !isSelf ? 'from-orange' : 'from-button'
        } ${!isSelf ? 'to-orangeButtonHover' : 'to-buttonHover2'}`}
      >
        {t(plan.title)}
      </div>
      <div className="flex justify-center items-center text-xl font-bold my-6 text-center">
        {t(plan.description)}
      </div>

      <div className="flex flex-col gap-3 text-sm mb-6 rounded-xl border-1 border-light p-4 text-base">
        {plan.benefits.map((item, index) => (
          <div
            key={item}
            className={`flex items-center gap-2 ${
              !isSelf && index === 0 ? 'font-bold' : ''
            }`}
          >
            <div
              className={`relative rounded-xl border-1 w-[12px] h-[12px] shrink-0 ${
                !isSelf ? 'border-orange' : 'border-button'
              }`}
            >
              <div
                className={`absolute transform rotate-45 left-[35%] top-[12%] h-[6px] w-[3px] border-b-1 border-r-1 ${
                  !isSelf ? 'border-orange' : 'border-button'
                }`}
              ></div>
            </div>
            <span>{t(item)}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-4 text-inputGray text-center text-sm">
        {plan.tips.map((item) => (
          <div key={item}>{t(item)}</div>
        ))}
      </div>
      <Button
        className="self-center mt-6 mx-auto"
        color={!isSelf ? 'orange' : undefined}
        disabled={isUpdatingUser}
        onClick={handleGetStartedClick}
      >
        {t('plans-selection.get-started')}
      </Button>
    </div>
  );
};

export default PlanItem;
