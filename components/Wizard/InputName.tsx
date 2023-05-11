import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'next-i18next';
import { useWizard } from 'react-use-wizard';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import Input from 'components/Input';
import BackButton from 'components/Buttons/BackButton';
import useStore from 'modules/Store';
import { UserRoles } from 'models/user/user';
import validations from 'utils/validations';

type Step1Form = {
  name_first: string;
  name_last: string;
};

interface Props {
  setActiveStepNumber: (value: number) => void;
}

const InputName: React.FC<Props> = ({ setActiveStepNumber }) => {
  const roles = useStore.getState().roles;
  const { t } = useTranslation();
  const validationSchema = Yup.object().shape({
    name_first: validations.firstName,
    name_last: validations.lastName,
  });

  const { previousStep, nextStep, activeStep, goToStep } = useWizard();

  useEffect(() => {
    setActiveStepNumber(activeStep);
  }, [setActiveStepNumber, activeStep]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<Step1Form>({
    resolver: yupResolver(validationSchema),
  });

  const name_first = watch('name_first');
  const name_last = watch('name_last');

  const onSubmit = (data: Step1Form) => {
    useStore.setState({ name_first: data.name_first });
    useStore.setState({ name_last: data.name_last });
    if (roles.includes(UserRoles.AGENCY)) {
      nextStep();
    } else if (roles.includes(UserRoles.LICENSEE)) {
      goToStep(4);
    } else {
      goToStep(5);
    }
  };

  const goBackAStep = () => {
    if (
      roles.includes(UserRoles.LICENSEE) ||
      roles.includes(UserRoles.LICENSOR)
    ) {
      previousStep();
    } else if (roles.includes(UserRoles.AGENCY)) {
      goToStep(0);
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
              type="text"
              register={register}
              label="whats-your-name"
              name="name_first"
              placeholder="Enter your first name"
              required={true}
              keydown={handleEnterPressed}
              enterMessage={true}
              watchedValue={name_first}
              defaultValue={useStore.getState().name_first}
            />
            <div className="h-4 ml-4 text-sm text-red-400 font-custom2">
              {t(errors.name_first?.message || '')}
            </div>
            <div className="mt-2 md:mt-8">
              <Input
                type="text"
                register={register}
                name="name_last"
                placeholder="Enter your last name"
                required={true}
                defaultValue={useStore.getState().name_last}
                showForwardButton={
                  name_last &&
                  name_first &&
                  name_last.length > 0 &&
                  name_first.length > 0
                    ? true
                    : false
                }
              />
              <div className="h-4 ml-4 text-sm text-red-400 font-custom2">
                {t(errors.name_last?.message || '')}
              </div>
            </div>
          </div>
        </form>
      </div>
      <div className="flex justify-center align-center m-28">
        <BackButton onClick={() => goBackAStep()} />
      </div>
    </>
  );
};

const handleEnterPressed = (event: React.KeyboardEvent<HTMLFormElement>) => {
  if (event.key.toLowerCase() === 'enter') {
    const form = event.target.form;
    const index = [...form].indexOf(event.target);
    form.elements[index + 1].focus();
    event.preventDefault();
  }
};

export default InputName;
