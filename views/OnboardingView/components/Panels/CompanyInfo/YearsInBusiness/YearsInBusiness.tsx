import { useTranslation } from 'next-i18next';
import React, { useContext } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import Accordion from 'components/new/Accordion';
import Button from 'components/new/Button';
import Input from 'components/new/InputField/InputField';
import { StepperContext } from 'pages/onboarding';
import type { CompanyInfoFormProperties } from '../CompanyInfoProperties.types';

const YearsInBusiness = () => {
  const { t } = useTranslation();
  const { control } = useFormContext<CompanyInfoFormProperties>();
  const { activeStepProgress, setActiveStepProgress } =
    useContext(StepperContext);

  return (
    <Accordion
      defaultOpen={activeStepProgress === 2}
      label={t('onboarding.how-many-years-in-business')}
      className="!w-full"
    >
      <div className="flex flex-col justify-center items-center w-full md:px-88 gap-16">
        <Controller
          name="business_years"
          control={control}
          render={({ field }) => (
            <Input
              fullWidth
              label={t('onboarding.years')}
              type="number"
              helperText=""
              onChange={field.onChange}
            />
          )}
        />

        <Button size="sm" className="w-full md:w-auto self-end">
          {t('onboarding.save-and-continue')}
        </Button>
      </div>
    </Accordion>
  );
};

export default YearsInBusiness;
