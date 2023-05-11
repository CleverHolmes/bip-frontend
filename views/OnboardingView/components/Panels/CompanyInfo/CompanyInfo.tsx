import React, { useContext } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { UserRoles } from 'models/user/user';
import useStore from 'modules/Store';
import { StepperContext } from 'pages/onboarding';
import ActiveLicenses from './ActiveLicenses';
import CompanyName from './CompanyName';
import OperatedTerritories from './OperatedTerritories';
import YearsInBusiness from './YearsInBusiness';
import validations from 'utils/validations';
import type { CompanyInfoFormProperties } from './CompanyInfoProperties.types';

const CompanyInfo = () => {
  // user roles
  const roles = useStore((state) => state.roles);
  const isLicensee = roles.includes(UserRoles.LICENSEE);
  const isLicensor = roles.includes(UserRoles.LICENSOR);

  const {
    activeStepNumber,
    setActiveStepNumber,
    activeStepProgress,
    setActiveStepProgress,
  } = useContext(StepperContext);

  const validationSchema = Yup.object().shape({
    company_name: validations.companyName,
  });
  const methods = useForm<CompanyInfoFormProperties>({
    defaultValues: {
      company_name: '',
      territories: [],
      business_years: 0,
      active_licensees: '',
    },
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = methods.handleSubmit((variables) => {
    const { company_name, territories, business_years, active_licensees } =
      variables;
    useStore.setState({
      company_name,
      territories,
      business_years,
      active_licensees,
    });
    const maxStepProgress = roles.includes(UserRoles.AGENCY) ? 0 : 1;
    setActiveStepProgress(activeStepProgress + 1);
    if (activeStepProgress > maxStepProgress) {
      setActiveStepNumber(activeStepNumber + 1);
    }
  });

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={onSubmit}
        className="flex flex-col justify-center items-center w-full max-w-screen-lg mx-auto pt-56"
      >
        <CompanyName />
        <OperatedTerritories />
        {isLicensee && <YearsInBusiness />}
        {isLicensor && <ActiveLicenses />}
      </form>
    </FormProvider>
  );
};

export default CompanyInfo;
