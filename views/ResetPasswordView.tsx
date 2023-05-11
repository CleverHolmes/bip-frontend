import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { NextRouter, useRouter } from 'next/router';

import Input from 'components/Input';
import Button from 'components/Buttons/Button';
import { throwError } from 'utils/error';
import validations from 'utils/validations';
import DialogModal from 'components/DialogModal';
import { postResetPasswordCall } from 'api/user/postResetPasswordCall';

type ResetPasswordForm = {
  password: string;
  confirmPassword: string;
};

const ResetPasswordView: React.FC = () => {
  const { t } = useTranslation();
  const validationSchema = Yup.object().shape({
    password: validations.password,
    confirmPassword: validations.confirmPassword,
  });

  const router: NextRouter = useRouter();
  const { email, password_reset_token } = router.query;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordForm>({
    mode: 'onSubmit',
    resolver: yupResolver(validationSchema),
  });

  const isValid = !Object.keys(errors).length;

  const [fetchPasswordError, setFetchPasswordError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const onSubmit = (data: ResetPasswordForm) => {
    if (!password_reset_token || !email) {
      setFetchPasswordError('*Link is invalid');
      return;
    }
    setIsSubmitting(true);

    const passwordData = {
      password: data.password,
      email: email.toString().replace(/ /g, '+'),
      password_reset_token: password_reset_token.toString(),
    };

    postResetPasswordCall(passwordData)
      .then(() => {
        setIsOpenModal(true);
        setIsSubmitting(false);
        setFetchPasswordError('');
      })
      .catch((err) => {
        setIsSubmitting(false);
        setFetchPasswordError(err.response.data.error);
        throwError(err);
      });
  };

  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);

  function closeModal() {
    setIsOpenModal(false);
    router.push('/login');
  }

  return (
    <>
      <Head>
        <title>BIP Reset Password</title>
      </Head>
      <div className="relative flex flex-col min-h-screen">
        <div className="mt-6 mb-2 text-xl font-bold text-center text-primary font-custom1 md:mb-4 lg:mb-6 md:text-3xl lg:text-5xl">
          {t('reset-password')}
        </div>
        <div className="md:px-20 lg:px-40 xl:px-60 2xl:px-80">
          <div className="z-10 flex flex-col justify-between max-w-3xl p-4 mt-4 mb-12 leading-normal bg-white border-2 shadow-md lg:container border-borderColor md:p-8 rounded-3xl lg:mx-auto">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="form-group">
                <div className="my-4">
                  <Input
                    type="password"
                    register={register}
                    label="enter-a-new-password"
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
                    name="confirmPassword"
                    placeholder={t('confirm-your-password')}
                    required={true}
                    smaller={true}
                    errorText={t(errors.confirmPassword?.message || '')}
                  />
                </div>
              </div>
              {fetchPasswordError && (
                <div className="h-4 mb-5 ml-4 text-sm text-red-400 font-custom2">
                  {fetchPasswordError}
                </div>
              )}
              <Button>{t('submit')}</Button>
            </form>
            <Link href="/login">
              <a className="flex justify-center mt-10 cursor-pointer text-inputGray hover:text-button">
                {t('login')}
              </a>
            </Link>
          </div>
        </div>
      </div>
      <DialogModal
        closeModal={closeModal}
        isOpen={isOpenModal}
        dialogTitle={t('reset-password-page.modal-header')}
      >
        <div className="py-10 mx-auto text-lg font-custom1 font-primary">
          {t('reset-password-page.modal-text')}
        </div>
        <Button
          smaller
          color="yellow"
          onClick={() => closeModal()}
          disabled={isSubmitting}
        >
          {t('reset-password-page.close-and-login')}
        </Button>
      </DialogModal>
    </>
  );
};

export default ResetPasswordView;
