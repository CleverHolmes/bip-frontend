import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';
import * as Yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { NextRouter, useRouter } from 'next/router';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import Modal from 'components/new/NewModal';
import Input from 'components/new/InputField/InputField';
import Radio from 'components/new/Radio';
import Link from 'components/new/Link';
import Alert from 'components/new/Alert';
import routes from 'constants/routes';
import { ErrorType } from 'public/axios';
import useStore from 'modules/Store';
import { validateEmail } from 'api/user/validateEmail';
import { ValidateEmailRequest } from 'models/user/validateEmail';
import validations from 'utils/validations';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onOpenLogin: () => void;
};

type UserSubmitForm = {
  email: string;
  password: string;
  stayLoggedIn: boolean;
  acceptTerms: boolean;
};

const SignUpModal: React.FC<Props> = ({ isOpen, onClose, onOpenLogin }) => {
  const { t } = useTranslation();
  const router: NextRouter = useRouter();

  const updateNewUser = useStore((state) => state.updateNewUser);

  const [signUpError, setSignUpError] = useState('');

  const validationSchema = Yup.object().shape({
    email: validations.email,
    password: validations.password,
    acceptTerms: validations.acceptTerms,
  });

  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<UserSubmitForm>({
    defaultValues: {
      acceptTerms: false,
    },
    resolver: yupResolver(validationSchema),
  });

  const { mutate: verifyEmail, isLoading } = useMutation(
    async (data: ValidateEmailRequest) => {
      return await validateEmail(data);
    },
    {
      onSuccess: (data) => {
        const user = {
          email: getValues('email'),
          password: getValues('password'),
          stayLoggedIn: getValues('stayLoggedIn'),
        };
        let isValid = true;

        if (!data.isAvailable) {
          setSignUpError(
            t('This email is already taken. Please enter another', {
              ns: 'errors',
            })
          );
          isValid = false;
        }

        if (!data.isValid) {
          setSignUpError(
            t(`This email is invalid. Please enter a valid one`, {
              ns: 'errors',
            })
          );

          isValid = false;
        }

        if (isValid) {
          updateNewUser(user);
          router.push(routes.onboarding);
        }
      },
      onError: (err: AxiosError<any, ErrorType>) => {
        setSignUpError(err?.response?.data.message);
      },
    }
  );

  const onSubmit = handleSubmit((variables) => {
    const { email } = variables;
    verifyEmail({
      email,
    });
  });

  return (
    <Modal
      isOpen={isOpen}
      modalTitle={t('sign-up')}
      closeModal={onClose}
      buttonPrimary={t('sign-up')}
      buttonSecondary={t('cancel')}
      onPrimaryAction={onSubmit}
      onSecondaryAction={onClose}
      disabledPrimary={isLoading}
      bottomLeftSlot={
        <div className="text-sm">
          {t('already-have-an-account')}{' '}
          <Link size="sm" onClick={onOpenLogin}>
            {t('login')}
          </Link>
        </div>
      }
    >
      {(signUpError || errors.acceptTerms?.message) && (
        <div className="mb-24">
          <Alert severity="error">
            {(errors.acceptTerms?.message && t(errors.acceptTerms?.message)) ||
              signUpError}
          </Alert>
        </div>
      )}
      <div className="mb-24">
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
              showError={!!errors.email?.message || !!signUpError}
              error={t(errors.email?.message || '')}
            />
          )}
        />
      </div>
      <div>
        <Controller
          name="password"
          control={control}
          render={({ field: { onChange }, formState: { errors } }) => (
            <Input
              fullWidth
              required
              label={t('create-a-password')}
              type="password"
              helperText={''}
              leftIcon="Lock"
              onChange={onChange}
              showError={!!errors.password?.message || !!signUpError}
              error={t(errors.password?.message || '')}
            />
          )}
        />
      </div>
      <div className="mt-40 flex items-start md:items-center justify-between flex-col md:flex-row gap-24">
        <Controller
          name="stayLoggedIn"
          control={control}
          render={({ field: { onChange, value } }) => (
            <Radio
              name="stayLoggedIn"
              label={t('keep-me-logged-in')}
              selected={!!value}
              onClick={() => onChange(!value)}
            />
          )}
        />
        <Controller
          name="acceptTerms"
          control={control}
          render={({ field: { onChange, value } }) => (
            <Radio
              name="acceptTerms"
              selected={!!value}
              showError={!!errors.acceptTerms?.message}
              onClick={() => onChange(!value)}
            >
              <div className="flex gap-4">
                {t('i-have-read-and-agree')}
                <Link href={routes.privacyPolicy} external size="sm">
                  {t('privacy-policy')}
                </Link>
              </div>
            </Radio>
          )}
        />
      </div>
    </Modal>
  );
};

export default SignUpModal;
