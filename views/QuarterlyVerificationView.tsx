import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { NextRouter, useRouter } from 'next/router';

import Paper from 'components/Paper';
import { FooterButtonsNoBack } from 'components/FooterButtonFolder/FooterButtonsNoBack';
import validations from 'utils/validations';
import Input from 'components/Input';
import routes from 'constants/routes';
import CircleLoaderSpinner from 'components/CircleLoaderSpinner';

type FormType = {
  royaltiesOwed: number;
};

const QuarterlyVerificationView: React.FC = () => {
  const { t } = useTranslation();
  const router: NextRouter = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const validationSchema = Yup.object().shape({
    email: validations.email,
    companyName: validations.companyName,
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormType>({
    mode: 'onSubmit',
    resolver: yupResolver(validationSchema),
  });
  const isValid = !Object.keys(errors).length;

  const onSubmit = async (data: FormType) => {
    setIsSubmitting(true);
    try {
      router.push(routes.congrats);
    } catch (error) {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {!isSubmitting && (
        <>
          <div className="mb-10 text-xl font-bold text-primary font-custom1 md:text-3xl lg:text-5xl">
            {t('quarterly-verification.title')}
          </div>
          <Paper className="mb-10">
            <div className="mb-16">
              <Input
                type="number"
                register={register}
                label="whats-royalty-owed"
                name="email"
                placeholder={t('enter-royalty-owed')}
                required={true}
                smaller={true}
                prefix="$"
                errorText={t(errors.royaltiesOwed?.message || '')}
              />
            </div>
          </Paper>
          <FooterButtonsNoBack
            onClickButton={handleSubmit(onSubmit)}
            buttonText={t('quarterly-verification.sign')}
            error={!isValid ? t('errors:all-fields-must-be-filled') : ''}
          />
        </>
      )}
      {isSubmitting && <CircleLoaderSpinner size={500} />}
    </>
  );
};

export default QuarterlyVerificationView;
