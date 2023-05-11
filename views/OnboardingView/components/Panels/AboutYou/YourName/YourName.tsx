import { useTranslation } from 'next-i18next';
import React, { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import Accordion from 'components/new/Accordion';
import Button from 'components/new/Button';
import Input from 'components/new/InputField/InputField';
import Radio from 'components/new/Radio';
import Link from 'components/new/Link';
import routes from 'constants/routes';
import type { AboutYouFormProperties } from '../AboutYou';

const YourName: React.FC = () => {
  const { t } = useTranslation();
  const { control } = useFormContext<AboutYouFormProperties>();
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);

  return (
    <Accordion label={t('onboarding.what-is-your-name')} className="!w-full">
      <div className="flex flex-col justify-center items-center w-full md:px-88 gap-16">
        <Controller
          name="name_first"
          control={control}
          render={({ field: { onChange }, formState: { errors } }) => (
            <Input
              fullWidth
              required
              label={t('first-name')}
              type="text"
              helperText={''}
              onChange={onChange}
              showError={!!errors.name_first?.message}
              error={t(errors.name_first?.message || '')}
            />
          )}
        />

        <Controller
          name="name_last"
          control={control}
          render={({ field: { onChange }, formState: { errors } }) => (
            <Input
              fullWidth
              required
              label={t('last-name')}
              width={'100%'}
              helperText={''}
              type="text"
              onChange={onChange}
              showError={!!errors.name_last?.message}
              error={t(errors.name_last?.message || '')}
            />
          )}
        />

        <div className="flex md:flex-row flex-col justify-between w-full mt-8 md:mt-40 items-center">
          <div className="flex flex-row">
            <Radio
              selected={isTermsAccepted}
              onClick={() => setIsTermsAccepted(!isTermsAccepted)}
            />
            <div className="ml-8 font-bodyText">
              {t('onboarding.you-agree-to-our')}{' '}
              <Link href={routes.termsOfUse} external>
                {t('onboarding.terms-and-conditions')}
              </Link>
            </div>
          </div>
          <Button
            disabled={!isTermsAccepted}
            size="sm"
            className="mt-24 md:mt-0 w-full md:w-auto"
          >
            {t('onboarding.save-and-continue')}
          </Button>
        </div>
      </div>
    </Accordion>
  );
};

export default YourName;
