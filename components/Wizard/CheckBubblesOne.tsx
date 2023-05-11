import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useWizard } from 'react-use-wizard';
import { useTranslation } from 'next-i18next';

import BackButton from 'components/Buttons/BackButton';
import Button from 'components/Buttons/Button';
import CheckBubbles from 'components/CheckBubbles';
import useStore, { StoreState } from 'modules/Store';
import InfoBox from 'components/InfoBox';

interface KeyboardEvent {
  enterKey: boolean;
}

interface Props {
  setActiveStepNumber: (value: number) => void;
  storeProperty: keyof StoreState;
  validationMessage: string;
  label: string;
  extraText?: string;
  max?: number;
  infoBox?: string;
  optional?: boolean;
}

const CheckBubblesOne: React.FC<Props> = ({
  setActiveStepNumber,
  storeProperty,
  validationMessage,
  label,
  max,
  infoBox,
  optional,
  extraText,
}) => {
  const defaultValue: any = useStore((state) => state[storeProperty]);
  const roles = useStore.getState().roles;
  const { t } = useTranslation();
  const { previousStep, nextStep, activeStep, goToStep } = useWizard();

  useEffect(() => {
    setActiveStepNumber(activeStep);
  }, [setActiveStepNumber, activeStep]);

  const { register, getValues, setValue } = useForm();

  const [state, setState] = useState<{ selections: string[] }>({
    selections: defaultValue,
  });

  const [error, setError] = useState<string>('');

  const submit = () => {
    if (state.selections.length === max) {
      useStore.setState({ [storeProperty]: state.selections });

      if (storeProperty === 'brands_represented') {
        if (roles.includes('licensor')) {
          goToStep(7);
        } else if (roles.includes('licensee')) {
          goToStep(9);
        } else {
          goToStep(10);
        }
      } else {
        nextStep();
      }
    } else if ((!max && state.selections.length > 0) || optional) {
      let item = getValues(storeProperty);
      let sel = state.selections;
      if (!sel.includes(item) && item) {
        sel.push(item);
      }
      useStore.setState({ [storeProperty]: sel });
      if (storeProperty === 'brands_represented') {
        if (roles.includes('licensor')) {
          goToStep(7);
        } else if (roles.includes('licensee')) {
          goToStep(9);
        } else {
          goToStep(10);
        }
      } else {
        nextStep();
      }
    } else {
      setError(validationMessage);
    }
  };

  return (
    <>
      <div className="relative flex flex-col mx-6 sm:mx-20 md:mx-40 lg:container lg:mx-auto lg:pl-36">
        <div className="my-4">
          <CheckBubbles
            register={register}
            checkList={defaultValue}
            label={label}
            extraText={extraText}
            required={true}
            bubbleName={storeProperty}
            state={state}
            setState={setState}
            max={max}
            getValues={getValues}
            setValue={setValue}
          />
          <div className="h-4 ml-4 text-sm text-red-400 font-custom2">
            {error && error}
          </div>
        </div>
        <Button onClick={() => submit()}>{t('next-step')}</Button>
        {infoBox && <InfoBox text={infoBox} />}
        <div className="flex justify-center align-center m-28">
          <BackButton onClick={() => previousStep()} />
        </div>
      </div>
    </>
  );
};

export default CheckBubblesOne;
