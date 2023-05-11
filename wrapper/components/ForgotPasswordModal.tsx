import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';
import * as Yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { Trans } from 'react-i18next';

import Modal from 'components/new/NewModal';
import Input from 'components/new/InputField/InputField';
import Link from 'components/new/Link';
import Alert from 'components/new/Alert';
import { ErrorType } from 'public/axios';
import { getResetPasswordCall } from 'api/user/getResetPasswordCall';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onOpenLogin: () => void;
};

type UserSubmitForm = {
  email: string;
};

const ForgotPasswordModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onOpenLogin,
}) => {
  const { t } = useTranslation();

  const [forgotPasswordError, setForgotPasswordError] = useState('');

  const validationSchema = Yup.object().shape({
    email: Yup.string().required('errors:enter-the-email'),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<UserSubmitForm>({
    resolver: yupResolver(validationSchema),
  });

  const {
    mutate: resetPassword,
    isLoading,
    isSuccess,
  } = useMutation(
    async (email: string) => {
      return await getResetPasswordCall(email);
    },
    {
      onError: (err: AxiosError<any, ErrorType>) => {
        setForgotPasswordError(err?.response?.data.message);
      },
    }
  );

  const onSubmit = handleSubmit((variables) => {
    const { email } = variables;
    resetPassword(email);
  });

  return (
    <Modal
      isOpen={isOpen}
      modalTitle={
        !isSuccess
          ? t('forgot-password-page.title')
          : t('forgot-password-page.success-title')
      }
      closeModal={onClose}
      buttonPrimary={!isSuccess ? t('forgot-password-page.reset') : undefined}
      buttonSecondary={t('close')}
      onPrimaryAction={onSubmit}
      onSecondaryAction={onClose}
      disabledPrimary={isLoading}
      bottomLeftSlot={
        !isSuccess ? (
          <div className="text-sm">
            {t('already-have-an-account')}{' '}
            <Link size="sm" onClick={onOpenLogin}>
              {t('login')}
            </Link>
          </div>
        ) : undefined
      }
    >
      {!isSuccess && (
        <div>
          {forgotPasswordError && (
            <div className="mb-24">
              <Alert severity="error">{forgotPasswordError}</Alert>
            </div>
          )}
          <Controller
            name="email"
            control={control}
            render={({ field: { onChange }, formState: { errors } }) => (
              <Input
                fullWidth
                required
                label={t('enter-your-email')}
                type="text"
                helperText={''}
                leftIcon="Mail"
                onChange={onChange}
                showError={!!errors.email?.message || !!forgotPasswordError}
                error={t(errors.email?.message || '')}
              />
            )}
          />
        </div>
      )}
      {isSuccess && (
        <div>
          <Trans
            i18nKey={'forgot-password-page.success-text'}
            components={{
              bold: <span className="font-bold" />,
            }}
          />
        </div>
      )}
    </Modal>
  );
};

export default ForgotPasswordModal;
