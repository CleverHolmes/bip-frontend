import { useTranslation } from 'next-i18next';
import React, { useContext } from 'react';
import { useFormContext } from 'react-hook-form';

import Accordion from 'components/new/Accordion';
import Button from 'components/new/Button';
import Radio from 'components/new/Radio';
import type { CompanyInfoFormProperties } from '../CompanyInfoProperties.types';
import { ActiveLicenseEnum } from '../CompanyInfoProperties.types';
import { StepperContext } from 'pages/onboarding';

const ActiveLicenses = () => {
  const { t } = useTranslation();
  const { setValue, watch } = useFormContext<CompanyInfoFormProperties>();
  const { activeStepProgress, setActiveStepProgress } =
    useContext(StepperContext);

  const activeLicenses = watch('active_licensees');

  const onChange = (activeLicenses: ActiveLicenseEnum) => {
    setValue('active_licensees', activeLicenses);
  };

  return (
    <Accordion
      defaultOpen={activeStepProgress === 2}
      label={t('onboarding.how-many-active-licenses-do-you-have')}
      className="!w-full"
    >
      <div className="flex flex-col lg:flex-row justify-center items-center md:px-88 gap-40 md:gap-16 w-full">
        <div className="flex flex-row w-full md:w-1/2 justify-between spacing">
          <Radio
            selected={activeLicenses === ActiveLicenseEnum.upto25}
            name={'active_licensees'}
            label={t('onboarding.active-licenses.0-25')}
            onClick={() => onChange(ActiveLicenseEnum.upto25)}
          />
          <Radio
            selected={activeLicenses === ActiveLicenseEnum.lessThan100}
            name={'active_licensees'}
            label={t('onboarding.active-licenses.26-100')}
            onClick={() => onChange(ActiveLicenseEnum.lessThan100)}
          />
          <Radio
            selected={activeLicenses === ActiveLicenseEnum.greaterThan100}
            name={'active_licensees'}
            label={t('onboarding.active-licenses.101+')}
            onClick={() => onChange(ActiveLicenseEnum.greaterThan100)}
          />
        </div>
        <Button size="sm" className="w-full md:w-auto self-end">
          {t('onboarding.save-and-continue')}
        </Button>
      </div>
    </Accordion>
  );
};

export default ActiveLicenses;
