import React, { useEffect, useState } from 'react';
import { useWizard } from 'react-use-wizard';
import { useTranslation } from 'next-i18next';

import BackButton from 'components/Buttons/BackButton';
import BubbleList from 'components/BubbleLists/BubbleList';
import Button from 'components/Buttons/Button';
import useStore, { StoreState } from 'modules/Store';

interface Props {
  setActiveStepNumber: (value: number) => void;
  list: any[];
  typeOfList: string[];
  validationMessage: string;
  label: string;
  storeProperty: keyof StoreState;
  selectAll?: boolean;
}

const SelectButtonsOne: React.FC<Props> = ({
  setActiveStepNumber,
  list,
  typeOfList,
  validationMessage,
  label,
  storeProperty,
  selectAll,
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

      if (storeProperty === 'territories') {
        if (roles.includes('agency')) {
          nextStep();
        } else if (roles.includes('licensor')) {
          goToStep(7);
        } else if (roles.includes('licensee')) {
          goToStep(9);
        }
      } else {
        setError(validationMessage);
      }
    }
  };

  const goBackAStep = () => {
    if (storeProperty === 'territories') {
      if (roles.includes('licensee')) {
        previousStep();
      } else if (roles.includes('agency')) {
        goToStep(3);
      } else {
        goToStep(2);
      }
    } else {
      previousStep();
    }
  };

  return (
    <>
      <div className="relative flex flex-col mx-6 sm:mx-20 md:mx-40 lg:container lg:mx-auto lg:pl-36">
        <div className="my-4">
          <BubbleList
            checkList={list}
            types={typeOfList}
            label={label}
            bubbleName={storeProperty}
            defaultValue={defaultValue}
            state={state}
            setState={setState}
            selectAll={selectAll}
            smaller
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

export default SelectButtonsOne;
