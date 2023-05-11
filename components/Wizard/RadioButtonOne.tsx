import React, { useEffect, useState } from 'react';
import { useWizard } from 'react-use-wizard';
import { useTranslation } from 'next-i18next';

import BackButton from 'components/Buttons/BackButton';
import Button from 'components/Buttons/Button';
import RadioButton from 'components/RadioButton';
import useStore, { StoreState } from 'modules/Store';

interface Props {
  setActiveStepNumber: (value: number) => void;
  storeProperty: keyof StoreState;
  validationMessage: string;
  choices: any;
  label: string;
  extraText?: string;
}

const RadioButtonOne: React.FC<Props> = ({
  setActiveStepNumber,
  storeProperty,
  validationMessage,
  choices,
  label,
  extraText,
}) => {
  const defaultValue: any = useStore((state) => state[storeProperty]);
  const roles = useStore.getState().roles;
  const { t } = useTranslation();
  const { previousStep, nextStep, activeStep, goToStep } = useWizard();

  useEffect(() => {
    setActiveStepNumber(activeStep);
  }, [setActiveStepNumber, activeStep]);

  const [selectedRadio, setSelectedRadio] = useState<string>(defaultValue);

  const radioHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedRadio(event.target.value);
  };

  const [error, setError] = useState('');

  const onSubmit = () => {
    if (selectedRadio.length === 0) {
      setError(validationMessage);
    } else {
      useStore.setState({ [storeProperty]: selectedRadio });

      if (storeProperty === 'active_licensees') {
        if (roles.includes('licensee') || roles.includes('licensor')) {
          nextStep();
        } else {
          goToStep(10);
        }
      } else {
        nextStep();
      }
    }
  };

  const goBackAStep = () => {
    if (storeProperty === 'active_licensees') {
      goToStep(5);
    } else {
      previousStep();
    }
  };

  return (
    <>
      <div className="relative flex flex-col mx-6 sm:mx-20 md:mx-40 lg:container lg:mx-auto lg:pl-36">
        <div className="my-4">
          <RadioButton
            radioObject={choices}
            label={label}
            extraText={extraText}
            defaultValue={useStore.getState()[storeProperty]}
            radioHandler={radioHandler}
            selectedRadio={selectedRadio}
          />
          <div className="h-4 ml-4 text-sm text-red-400 font-custom2">
            {error && error}
          </div>
        </div>
        <Button onClick={onSubmit}>{t('next-step')}</Button>
        <div className="flex justify-center align-center m-28">
          <BackButton onClick={() => goBackAStep()} />
        </div>
      </div>
    </>
  );
};

export default RadioButtonOne;
