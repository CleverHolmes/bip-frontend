import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'next-i18next';
import { useWizard } from 'react-use-wizard';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { NumberFormatValues } from 'react-number-format';

import Input from 'components/Input';
import BackButton from 'components/Buttons/BackButton';
import useStore, { StoreState } from 'modules/Store';
import { UserRoles } from 'models/user/user';

type StepForm = {
  [storeProperty: string]: string;
};

interface Props {
  setActiveStepNumber: (value: number) => void;
  label: string;
  extraText?: string;
  storeProperty: keyof StoreState;
  validation: any;
  placeholder: string;
  type: 'number' | 'text' | 'email';
  optional?: boolean;
  infoBox?: string;
  thousandSeparator?: string;
  decimalScale?: number;
  isAllowed?: (values: NumberFormatValues) => boolean;
}

const SingleInput: React.FC<Props> = ({
  setActiveStepNumber,
  storeProperty,
  validation,
  label,
  placeholder,
  type,
  optional,
  infoBox,
  extraText,
  thousandSeparator,
  decimalScale,
  isAllowed,
}) => {
  const defaultValue: any = useStore((state) => state[storeProperty]);
  const roles = useStore.getState().roles;
  const { t } = useTranslation();
  const { previousStep, nextStep, activeStep, goToStep } = useWizard();

  const validationSchema = Yup.object().shape({
    [storeProperty]: validation,
  });

  useEffect(() => {
    setActiveStepNumber(activeStep);
  }, [setActiveStepNumber, activeStep]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<StepForm>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      [storeProperty]: defaultValue,
    },
  });
  const watchedValue = watch(storeProperty);

  const onSubmit = (data: StepForm) => {
    useStore.setState({
      [storeProperty]: data[storeProperty],
    });
    if (
      storeProperty === 'company_name' &&
      (roles.includes(UserRoles.LICENSEE) || roles.includes(UserRoles.LICENSOR))
    ) {
      return nextStep();
    }
    return goToStep(5);
  };

  const goBackAStep = () => {
    if (storeProperty === 'business_years') {
      if (
        roles.includes(UserRoles.LICENSEE) ||
        roles.includes(UserRoles.LICENSOR)
      ) {
        goToStep(2);
      } else {
        previousStep();
      }
    } else {
      previousStep();
    }
  };

  return (
    <>
      <div className="relative flex flex-col mx-6 sm:mx-20 md:mx-40 lg:container lg:mx-auto lg:pl-36">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="my-4">
            <Input
              type={type}
              register={register}
              label={label}
              extraText={extraText}
              name={storeProperty}
              placeholder={placeholder}
              required={true}
              enterMessage={false}
              watchedValue={watchedValue}
              defaultValue={defaultValue}
              thousandSeparator={thousandSeparator}
              decimalScale={decimalScale}
              setValue={setValue}
              showForwardButton={
                watchedValue && watchedValue.length > 0
                  ? true
                  : optional
                  ? true
                  : false
              }
              isAllowed={isAllowed}
            />
            <div className="h-4 ml-4 text-sm text-red-400 font-custom2">
              {t(errors[storeProperty]?.message || '')}
            </div>
          </div>
          {infoBox && (
            <div
              className="flex flex-wrap items-center max-w-2xl px-4 py-3 my-20 text-sm font-bold text-white bg-blue-400 rounded-lg font-custom2"
              role="alert"
            >
              <svg
                className="w-4 h-4 mr-2 fill-current"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M12.432 0c1.34 0 2.01.912 2.01 1.957 0 1.305-1.164 2.512-2.679 2.512-1.269 0-2.009-.75-1.974-1.99C9.789 1.436 10.67 0 12.432 0zM8.309 20c-1.058 0-1.833-.652-1.093-3.524l1.214-5.092c.211-.814.246-1.141 0-1.141-.317 0-1.689.562-2.502 1.117l-.528-.88c2.572-2.186 5.531-3.467 6.801-3.467 1.057 0 1.233 1.273.705 3.23l-1.391 5.352c-.246.945-.141 1.271.106 1.271.317 0 1.357-.392 2.379-1.207l.6.814C12.098 19.02 9.365 20 8.309 20z" />
              </svg>
              <p>{infoBox}</p>
            </div>
          )}
        </form>
      </div>
      <div className="flex justify-center align-center m-28">
        <BackButton onClick={() => goBackAStep()} />
      </div>
    </>
  );
};

export default SingleInput;
