import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';
import * as Yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useCookies } from 'react-cookie';
import { NextRouter, useRouter } from 'next/router';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import Modal from 'components/new/NewModal';
import Input from 'components/new/InputField/InputField';
import Radio from 'components/new/Radio';
import Link from 'components/new/Link';
import Alert from 'components/new/Alert';
import useAuth from 'hooks/useAuth';
import useStorage from 'hooks/useStorage';
import routes from 'constants/routes';
import { ErrorType } from 'public/axios';
import useStore from 'modules/Store';
import useTokensOrCookies from 'contexts/TokensOrCookies';
import { authenticationRequest } from 'api/authentication/authenticationRequest';
import { AuthenticationRequest } from 'models/authentication/authentication';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onOpenSignUp: () => void;
  onOpenForgotPassword: () => void;
};

type UserSubmitForm = {
  email: string;
  password: string;
  stayLoggedIn: boolean;
};

const LoginModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onOpenSignUp,
  onOpenForgotPassword,
}) => {
  const { t } = useTranslation();
  const router: NextRouter = useRouter();

  const { setTokens } = useAuth();
  const { setItem } = useStorage();
  const [, setCookie] = useCookies([
    'company_represented',
    'operating_user',
    'primary_user',
    'access_token',
    'CookieConsent',
  ]);
  const {
    handleSetCompanyRepresented,
    handleSetAccessToken,
    handleSetOperatingUser,
    handleSetPrimaryUser,
  } = useTokensOrCookies();

  const [loginError, setLoginError] = useState('');

  const validationSchema = Yup.object().shape({
    email: Yup.string().required('errors:enter-the-email'),
    password: Yup.string().required('errors:enter-the-password'),
  });

  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<UserSubmitForm>({
    resolver: yupResolver(validationSchema),
  });

  const { mutate, isLoading } = useMutation(
    async (data: AuthenticationRequest) => {
      return await authenticationRequest(data);
    },
    {
      onSuccess: (data) => {
        useStore.setState({ logIn: true });
        handleSetAccessToken(data.token);
        if (data.primary_user_uuid) {
          handleSetCompanyRepresented(data.primary_user_uuid);
          handleSetPrimaryUser(data.primary_user_uuid);
          handleSetOperatingUser(data.user_uuid);
        }
        if (getValues('stayLoggedIn')) {
          setTokens(data.token);
          data.primary_user_uuid &&
            setCookie('company_represented', data.primary_user_uuid, {
              path: '/',
              maxAge: 60 * 60 * 24 * 365,
            });
          data.primary_user_uuid &&
            setCookie('primary_user', data.primary_user_uuid, {
              path: '/',
              maxAge: 60 * 60 * 24 * 365,
            });
          data.primary_user_uuid &&
            setCookie('operating_user', data.user_uuid, {
              path: '/',
              maxAge: 60 * 60 * 24 * 365,
            });
        } else {
          setItem('access_token', data.token, 'session');
          if (data.primary_user_uuid) {
            setItem('company_represented', data.primary_user_uuid, 'session');
            setItem('primary_user', data.primary_user_uuid, 'session');
            setItem('operating_user', data.user_uuid, 'session');
          }
        }
        const page = useStore.getState().current_page;
        useStore.setState({ logIn: false });
        if (!!page) {
          router.push(`${page}`);
        } else {
          router.push(routes.explore);
        }
      },
      onError: (err: AxiosError<any, ErrorType>) => {
        setLoginError(err?.response?.data.message);
      },
    }
  );

  const onSubmit = handleSubmit((variables) => {
    const { email, password } = variables;
    mutate({ email, password });
  });

  return (
    <Modal
      isOpen={isOpen}
      modalTitle={t('login')}
      closeModal={onClose}
      buttonPrimary={t('login')}
      buttonSecondary={t('cancel')}
      onPrimaryAction={onSubmit}
      onSecondaryAction={onClose}
      disabledPrimary={isLoading}
      bottomLeftSlot={
        <div className="text-sm">
          {t('dont-have-an-account')}{' '}
          <Link size="sm" onClick={onOpenSignUp}>
            {t('sign-up')}
          </Link>
        </div>
      }
    >
      {loginError && (
        <div className="mb-24">
          <Alert severity="error">{loginError}</Alert>
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
              showError={!!errors.email?.message || !!loginError}
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
              label={t('enter-your-password')}
              type="password"
              helperText={''}
              leftIcon="Lock"
              onChange={onChange}
              showError={!!errors.password?.message || !!loginError}
              error={t(errors.password?.message || '')}
            />
          )}
        />
      </div>
      <div className="mt-40 flex items-start sm:items-center justify-between flex-col sm:flex-row gap-24">
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
        <Link size="sm" onClick={onOpenForgotPassword}>
          {t('forgot-password')}
        </Link>
      </div>
    </Modal>
  );
};

export default LoginModal;
