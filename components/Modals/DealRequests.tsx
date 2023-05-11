import { useTranslation } from 'next-i18next';
import React from 'react';
import { useForm } from 'react-hook-form';
import Image from 'next/image';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import Button from 'components/Buttons/Button';
import {
  ModalDismissAsyncButton,
  useModalContext,
} from 'components/ModalWindow';
import RadioButtonField from 'views/ProductView/components/RadioButtonField';
import PopoverPanel from 'components/PopoverPanel';
import { modifyAccountFlagCall } from 'api/admin/modifyAccountFlagCall';
import { ModifyAccountFlagRequest } from 'models/admin/modifyAccountFlag';
import { AccountFlags } from 'models/user/user';
import { getCurrentUuid } from 'utils/getCurrentUuid';
import { getUserQueryKey } from 'api/user/getUserCall';
import useStore from 'modules/Store';

interface Props {
  defaultValue?: boolean;
  refreshUser: () => void;
}

export type FormProps = {
  dealRequests: string;
};

const DealRequests: React.FC<Props> = ({ defaultValue, refreshUser }) => {
  const { t } = useTranslation();
  const currentUuid = getCurrentUuid(true);
  const queryClient = useQueryClient();
  const { setIsOpen } = useModalContext();

  const infoElement = (text: string) => (
    <div className={`inline-block w-[${20}px] h-[${20}px] shrink-0`}>
      <PopoverPanel
        panelClasses="mt-0 text-base"
        buttonElem={() => (
          <Image
            src="/images/info-icon.svg"
            alt="Info"
            width={20}
            height={20}
          />
        )}
      >
        <div className="font-normal">{text}</div>
      </PopoverPanel>
    </div>
  );

  const radioItems = [
    {
      label: (
        <div className="flex gap-2 items-center">
          {t('settings.deal-requests-select-anyone-can-send')}
          {infoElement(t('settings.deal-requests-select-anyone-can-send-tip'))}
        </div>
      ),
      value: 'yes',
    },
    {
      label: (
        <div className="flex gap-2 items-center">
          {t('settings.deal-requests-select-only-verified')}
          {infoElement(t('settings.deal-requests-select-only-verified-tip'))}
        </div>
      ),
      value: 'no',
    },
  ];

  const { register, handleSubmit } = useForm<FormProps>({
    defaultValues: {
      dealRequests: defaultValue ? 'no' : 'yes',
    },
    mode: 'onSubmit',
  });

  const { isLoading: isUpdatingAccountFlag, mutate: updateAccountFlag } =
    useMutation(
      async (data: ModifyAccountFlagRequest) => {
        return await modifyAccountFlagCall(data);
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: [getUserQueryKey],
          });
          refreshUser();
          useStore.setState({ refreshUserAppWrapper: true });
          setIsOpen(false);
        },
      }
    );

  const onSubmit = (data: FormProps) => {
    updateAccountFlag({
      userUuid: currentUuid,
      modificationOperation: data.dealRequests === 'yes' ? 'remove' : 'set',
      accountFlag: AccountFlags.DEAL_MAKING_PERMITTED_BY_VERIFIED_USERS_ONLY,
    });
  };

  return (
    <>
      <RadioButtonField
        register={register}
        name="dealRequests"
        label="settings.deal-requests-description"
        items={radioItems}
        isVertical
      />
      <div className="flex items-center justify-center my-10">
        <ModalDismissAsyncButton>
          <Button
            disabled={isUpdatingAccountFlag}
            onClick={() => handleSubmit(onSubmit)()}
          >
            {t('submit')}
          </Button>
        </ModalDismissAsyncButton>
      </div>
    </>
  );
};

export default DealRequests;
