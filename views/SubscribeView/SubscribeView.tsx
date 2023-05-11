import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';
import * as Yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Image from 'next/image';
import { useMutation } from '@tanstack/react-query';

import validations from 'utils/validations';
import Input from './components/InputField';
import Button from './components/Button';
import { EmailSubmissionRequest } from 'models/user/emailSubmission';
import { emailSubmissionCall } from 'api/user/emailSubmissionCall';

type FormType = {
  email: string;
};

const SubscribeView: React.FC = () => {
  const { t } = useTranslation();
  const [isSent, setIsSent] = useState(false);
  const validationSchema = Yup.object().shape({
    email: validations.email,
  });
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormType>({
    mode: 'onSubmit',
    resolver: yupResolver(validationSchema),
  });

  const { mutate, isLoading } = useMutation(
    async (data: EmailSubmissionRequest) => {
      return await emailSubmissionCall(data);
    },
    {
      onSuccess: () => {
        setIsSent(true);
      },
    }
  );

  const onSubmit = handleSubmit((variables) => {
    const { email } = variables;
    mutate({ email });
  });

  return (
    <>
      <div className="pt-[4rem] flex justify-center items-center flex-col px-[2rem]">
        <div>
          <Image
            src="/images/LogoPrimary.svg"
            width={80}
            height={52}
            alt="BIP logo"
          />
        </div>
        {!isSent ? (
          <form onSubmit={onSubmit} noValidate={true}>
            <div className="relative z-20 flex justify-center items-center flex-col gap-[1.75rem] mt-[6rem]">
              <h1 className="text-4xl font-bold text-center mb-[1.75rem]">
                {t('subscribe.title')}
              </h1>
              <Controller
                name="email"
                control={control}
                render={({ field: { onChange }, formState: { errors } }) => (
                  <Input
                    fullWidth
                    required
                    leftIcon="Mail"
                    placeholder={t('subscribe.email-placeholder')}
                    width={'100%'}
                    type="text"
                    onChange={onChange}
                    error={t(errors.email?.message || '')}
                  />
                )}
              />
              <Button
                disabled={isLoading}
                variant="primary"
                size="lg"
                className="w-full md:w-auto"
              >
                {t('subscribe.button')}
              </Button>
            </div>
          </form>
        ) : (
          <div className="relative z-20 flex justify-center items-center flex-col mt-[3.5rem]">
            <h1 className="text-4xl font-bold text-center mb-[0.5rem]">
              {t('subscribe.title2')}
            </h1>
            <div className="text-center text-grayN100 mb-[1.75rem]">
              {t('subscribe.description')}
            </div>

            <video
              controls
              controlsList="nodownload"
              width="608"
              className="max-w-[38-rem] h-auto rounded-[1rem] mb-[1.75rem]"
            >
              <source src="/bip.mp4" type="video/mp4" />
            </video>
            <Button
              variant="secondary"
              size="lg"
              className="w-full md:w-auto"
              onClick={() => setIsSent(false)}
            >
              {t('subscribe.back')}
            </Button>
          </div>
        )}
      </div>
      <img
        src={
          !isSent ? '/images/subscribe-bg.svg' : '/images/subscribe-bg-2.svg'
        }
        alt="BIP logo"
        className="fixed bottom-0 left-1/2 m-auto transform -translate-x-1/2 min-w-[48rem] -z-10"
      />
    </>
  );
};

export default SubscribeView;
