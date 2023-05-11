import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from 'next-i18next';
import * as Yup from 'yup';

import Button from 'components/Buttons/Button';
import Input from 'components/Input';
import validations from 'utils/validations';
import { postChangePasswordCall } from 'api/user/postChangePasswordCall';

type Props = {
  onChangePassword: () => void;
};

export type ChangePasswordForm = {
  password: string;
  newPassword: string;
  confirmNewPassword: string;
};

const ChangePassword: React.FC<Props> = ({ onChangePassword }) => {
  const { t } = useTranslation();
  const validationSchema = Yup.object().shape({
    password: validations.password,
    newPassword: validations.newPassword,
    confirmNewPassword: validations.confirmNewPassword,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangePasswordForm>({
    mode: 'onSubmit',
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = (data: ChangePasswordForm) => {
    setIsSubmitting(true);

    postChangePasswordCall({
      password_current: data.password,
      password_new: data.newPassword,
    })
      .then(() => {
        onChangePassword();
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
      <div className="form-group">
        <div className="my-4">
          <Input
            type="password"
            register={register}
            label="whats-your-password"
            name="password"
            placeholder={t('enter-your-password')}
            required={true}
            smaller={true}
            errorText={t(errors.password?.message || '')}
          />
        </div>
        <div className="my-4">
          <Input
            type="password"
            register={register}
            label="change-password.whats-your-new-password"
            name="newPassword"
            placeholder={t('change-password.enter-your-new-password')}
            required={true}
            smaller={true}
            errorText={t(errors.newPassword?.message || '')}
          />
        </div>
        <div className="my-4">
          <Input
            type="password"
            register={register}
            name="confirmNewPassword"
            placeholder={t('change-password.confirm-your-new-password')}
            required={true}
            smaller={true}
            errorText={t(errors.confirmNewPassword?.message || '')}
          />
        </div>
      </div>
      <Button disabled={isSubmitting} className="self-center mt-4">
        {t('submit')}
      </Button>
    </form>
  );
};

export default ChangePassword;
