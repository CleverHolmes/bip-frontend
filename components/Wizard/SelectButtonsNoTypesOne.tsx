import React, { useEffect, useState } from 'react';
import { useWizard } from 'react-use-wizard';
import { useTranslation } from 'next-i18next';

import BackButton from 'components/Buttons/BackButton';
import BubbleListNoTypes from 'components/BubbleLists/BubbleListNoTypes';
import Button from 'components/Buttons/Button';
import useStore, { StoreState } from 'modules/Store';

interface Props {
  setActiveStepNumber: (value: number) => void;
  list: any[];
  validationMessage: string;
  label: string;
  extraText?: string;
  storeProperty: keyof StoreState;
}

const SelectButtonsNoTypesOne: React.FC<Props> = ({
  setActiveStepNumber,
  list,
  validationMessage,
  label,
  storeProperty,
  extraText,
}) => {
  const defaultValue: any = useStore((state) => state[storeProperty]);
  const roles = useStore.getState().roles;
  const { t } = useTranslation();
  const { previousStep, nextStep, activeStep, goToStep } = useWizard();

  useEffect(() => {
    setActiveStepNumber(activeStep);
  }, [setActiveStepNumber, activeStep]);

  const [state, setState] = useState<{ selections: string[] }>({
    selections: defaultValue,
  });

  const [error, setError] = useState<string>('');

  const onSubmit = () => {
    if (state.selections.length > 0) {
      useStore.setState({ [storeProperty]: state.selections });
      return nextStep();
    } else {
      setError(validationMessage);
    }
  };

  const goBackAStep = () => {
    if (storeProperty === 'categories') {
      if (roles.includes('licensor')) {
        previousStep();
      } else if (roles.includes('agency')) {
        goToStep(6);
      } else {
        goToStep(5);
      }
    } else {
      previousStep();
    }
  };

  return (
    <>
      <div className="relative flex flex-col mx-6 sm:mx-20 md:mx-40 lg:container lg:mx-auto lg:pl-36">
        <div className="my-4">
          <BubbleListNoTypes
            checkList={list}
            label={label}
            extraText={extraText}
            bubbleName={storeProperty}
            defaultValue={defaultValue}
            state={state}
            setState={setState}
          />
          <div className="h-4 ml-4 text-sm text-red-400 font-custom2">
            {error && error}
          </div>
        </div>
        <Button onClick={() => onSubmit()}>{t('next-step')}</Button>
      </div>
      <div className="flex justify-center align-center m-28">
        <BackButton onClick={() => goBackAStep()} />
      </div>
    </>
  );
};

export default SelectButtonsNoTypesOne;
