import { useTranslation } from 'next-i18next';
import React, { useContext } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import Accordion from 'components/new/Accordion';
import Button from 'components/new/Button';
import Input from 'components/new/InputField/InputField';
import { UserRoles } from 'models/user/user';
import useStore from 'modules/Store';
import { StepperContext } from 'pages/onboarding';
import type { CompanyInfoFormProperties } from '../CompanyInfoProperties.types';

const CompanyName = () => {
  const { t } = useTranslation();
  const { control } = useFormContext<CompanyInfoFormProperties>();
  const { activeStepProgress, setActiveStepProgress } =
    useContext(StepperContext);
  const roles = useStore((state) => state.roles);
  const isAgency = roles.includes(UserRoles.AGENCY);

  return (
    <Accordion
      defaultOpen={activeStepProgress === 0}
      label={
        isAgency
          ? t('onboarding.what-is-your-agency-name')
          : t('onboarding.what-is-your-company-name')
      }
      className="!w-full"
    >
      <div className="flex flex-col justify-center items-center w-full md:px-88 gap-16">
        <Controller
          name="company_name"
          control={control}
          render={({ field: { onChange }, formState: { errors }}) => (
            <Input
              fullWidth
              label={
                isAgency
                  ? t('onboarding.agency-name-capitalized')
                  : t('onboarding.company-name-capitalized')
              }
              type={'text'}
              onChange={onChange}
              helperText={''}
              showError={!!errors.company_name?.message}
              error={t(errors.company_name?.message || '')}
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

export default CompanyName;
