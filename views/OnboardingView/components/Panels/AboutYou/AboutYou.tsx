import React, { useContext } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from 'next-i18next';

import { UserRoles } from 'models/user/user';
import useStore from 'modules/Store';
import { StepperContext } from 'pages/onboarding';
import YourName from './YourName';
import YourRole from './YourRole';
import validations from 'utils/validations';

export type AboutYouFormProperties = {
  name_first: string;
  name_last: string;
  roles: UserRoles[];
};

const AboutYou = () => {
  const { t } = useTranslation();
  const { activeStepNumber, setActiveStepNumber } = useContext(StepperContext);
  const validationSchema = Yup.object().shape({
    name_first: validations.firstName,
    name_last: validations.lastName,
    roles: validations.roles,
  });
  const methods = useForm<AboutYouFormProperties>({
    defaultValues: {
      name_first: '',
      name_last: '',
      roles: [],
    },
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = methods.handleSubmit((variables) => {
    const { roles, name_first, name_last } = variables;
    setActiveStepNumber(activeStepNumber + 1);
    useStore.setState({ roles, name_first, name_last });
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={onSubmit} noValidate={true}>
        <div className="flex flex-col justify-center items-center w-full max-w-screen-lg mx-auto pt-56">
          <YourRole />
          <div className="h-auto w-full font-bodyText text-sm text-redN300 relative -top-14">
            {t(methods.formState.errors.roles?.message || '')}
          </div>
          <YourName />
        </div>
      </form>
    </FormProvider>
  );
};

export default AboutYou;
