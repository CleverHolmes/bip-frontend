import React, { useEffect, useState } from 'react';
import { useWizard } from 'react-use-wizard';
import { useTranslation } from 'next-i18next';

import BackButton from 'components/Buttons/BackButton';
import TextArea from 'components/TextArea';
import useStore, { StoreState } from 'modules/Store';

interface KeyboardEvent {
  enterKey: boolean;
}

type StepForm = {
  [storeProperty: string]: string;
};

interface Props {
  setActiveStepNumber: (value: number) => void;
  label: string;
  storeProperty: keyof StoreState;
  validationMessage: string;
  placeholder: string;
}

const TextAreaOne: React.FC<Props> = ({
  setActiveStepNumber,
  label,
  storeProperty,
  validationMessage,
  placeholder,
}) => {
  const defaultValue: any = useStore((state) => state[storeProperty]);
  const { t } = useTranslation();
  const { previousStep, nextStep, activeStep, goToStep } = useWizard();

  const [error, setError] = useState<string>('');
  const [text, setText] = useState<string>(defaultValue);

  useEffect(() => {
    setActiveStepNumber(activeStep);
  }, [setActiveStepNumber, activeStep]);

  const onSubmit = () => {
    if (text.length === 0) {
      setError(validationMessage);
    } else {
      useStore.setState({
        [storeProperty]: text,
      });
    }
    nextStep();
  };

  const onChange = (e: React.FormEvent<HTMLInputElement>) => {
    setText(e.currentTarget.value);
  };

  return (
    <>
      <div className="relative flex flex-col mx-6 sm:mx-20 md:mx-40 lg:container lg:mx-auto lg:pl-36">
        <div className="my-4">
          <TextArea
            label={label}
            name={storeProperty}
            placeholder={placeholder}
            enterMessage={true}
            value={text}
            onChange={onChange}
            onSubmit={onSubmit}
            showForwardButton={text && text.length > 0 ? true : false}
          />
          <div className="h-4 ml-4 text-sm text-red-400 font-custom2">
            {error && error}
          </div>
        </div>
      </div>
      <div className="flex justify-center align-center m-28">
        <BackButton onClick={() => previousStep()} />
      </div>
    </>
  );
};

export default TextAreaOne;
