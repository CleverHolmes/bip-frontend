import React from 'react';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from 'next-i18next';
import * as Yup from 'yup';
import Link from 'next/link';

import Button from 'components/Buttons/Button';
import validations from 'utils/validations';
import Checkbox from 'components/Checkbox';
import { modifyAccountFlagCall } from 'api/admin/modifyAccountFlagCall';
import { ModifyAccountFlagRequest } from 'models/admin/modifyAccountFlag';
import { AccountFlags } from 'models/user/user';
import { getCurrentUuid } from 'utils/getCurrentUuid';
import routes from 'constants/routes';

type Props = {
  onAcceptTerms: () => void;
};

export type AcceptTermsForm = {
  acceptTerms: boolean;
};

const AcceptTerms: React.FC<Props> = ({ onAcceptTerms }) => {
  const { t } = useTranslation();
  const currentUuid = getCurrentUuid(true);

  const validationSchema = Yup.object().shape({
    acceptTerms: validations.acceptTerms,
  });

  const { isLoading: isUpdatingAccountFlag, mutate: updateAccountFlag } =
    useMutation(
      async (data: ModifyAccountFlagRequest) => {
        return await modifyAccountFlagCall(data);
      },
      {
        onSuccess: () => {
          onAcceptTerms();
        },
      }
    );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AcceptTermsForm>({
    mode: 'onSubmit',
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = () => {
    updateAccountFlag({
      userUuid: currentUuid,
      modificationOperation: 'remove',
      accountFlag: AccountFlags.TERMS_NOT_ACCEPTED,
    });
  };

  return (
    <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
      <div className="my-4 flex items-end">
        <label className="block mr-4 text-lg md:text-xl lg:text-2xl">
          <div className="text-primary mb-1">{t('i-have-read-and-agree')} </div>
          <Link href={routes.privacyPolicy}>
            <a target="_blank">
              <span className="underline cursor-pointer underline-offset-8 hover:text-button mr-2">
                {t('privacy-policy')},
              </span>
            </a>
          </Link>
          <Link href={routes.licensorTerms}>
            <a target="_blank">
              <span className="underline cursor-pointer underline-offset-8 hover:text-button mr-2">
                {t('licensor-terms')},
              </span>
            </a>
          </Link>
          <Link href={routes.licenseeTerms}>
            <a target="_blank">
              <span className="underline cursor-pointer underline-offset-8 hover:text-button">
                {t('licensee-terms')}
              </span>
            </a>
          </Link>
        </label>
        <Checkbox register={register} name="acceptTerms" required={true} />
      </div>
      {errors.acceptTerms?.message && (
        <div className="h-4 text-center text-sm text-red-400 font-custom2">
          {t(errors.acceptTerms.message)}
        </div>
      )}
      <Button disabled={isUpdatingAccountFlag} className="self-center mt-4">
        {t('submit')}
      </Button>
    </form>
  );
};

export default AcceptTerms;
