import React, { useEffect, useState } from 'react';
import { useWizard } from 'react-use-wizard';
import { useTranslation } from 'next-i18next';

import BackButton from 'components/Buttons/BackButton';
import Button from 'components/Buttons/Button';
import CheckBoxes from 'components/CheckBoxes';
import useStore, { StoreState } from 'modules/Store';
import InfoBox from 'components/InfoBox';

interface Props {
  setActiveStepNumber: (value: number) => void;
  firstQuestion: boolean;
  options: any;
  label: string;
  storeProperty: keyof StoreState;
  validationMessage: string;
  infoBox?: string;
}

const CheckBoxOne: React.FC<Props> = ({
  setActiveStepNumber,
  firstQuestion,
  options,
  storeProperty,
  label,
  infoBox,
  validationMessage,
}) => {
  const defaultValue: any = useStore((state) => state[storeProperty]);
  const { t } = useTranslation();
  const { previousStep, nextStep, activeStep, goToStep } = useWizard();

  useEffect(() => {
    setActiveStepNumber(activeStep);
  }, [setActiveStepNumber, activeStep]);

  const [state, setState] = React.useState<{ selections: string[] }>({
    selections: defaultValue,
  });

  const [error, setError] = useState('');

  function handleCheckboxChange(key: string) {
    let sel = state.selections;
    let find = sel.indexOf(key);
    if (find > -1) {
      sel.splice(find, 1);
    } else {
      sel.push(key);
    }
    setError('');

    setState({
      selections: sel,
    });
  }

  const onSubmit = () => {
    if (state.selections.length === 0) {
      setError(validationMessage);
    } else {
      useStore.setState({ [storeProperty]: state.selections });
      if (storeProperty === 'roles') {
        if (
          state.selections.includes('licensee') ||
          state.selections.includes('licensor')
        ) {
          nextStep();
        } else {
          goToStep(2);
        }
      } else {
        nextStep();
      }
    }
  };

  return (
    <>
      <div className="relative flex flex-col mx-6 sm:mx-20 md:mx-40 lg:container lg:mx-auto lg:pl-36">
        <div className="my-4">
          <CheckBoxes
            selections={state.selections}
            checkList={options}
            label={label}
            onChange={handleCheckboxChange}
          />
          <div className="h-4 ml-4 text-sm text-red-400 font-custom2">
            {error && error}
          </div>
        </div>
        <Button className="mb-10 " onClick={onSubmit}>
          {t('next-step')}
        </Button>
      </div>
      {infoBox && <InfoBox text={infoBox} />}
      {!firstQuestion && (
        <div className="flex justify-center align-center m-28">
          <BackButton onClick={() => previousStep()} />
        </div>
      )}
    </>
  );
};

export default CheckBoxOne;
