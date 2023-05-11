import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { UseFormRegister, FieldValues } from 'react-hook-form';

import Input from 'components/Input';
import SelectButton from 'components/Buttons/SelectButton';

type Props = {
  checkList: string[];
  label?: string;
  extraText?: string;
  register: UseFormRegister<FieldValues>;
  required: boolean;
  bubbleName: string;
  state: any;
  setState: any;
  max?: number;
  smaller?: boolean;
  getValues?: any;
  setValue?: any;
};

const CheckBubbles: React.FC<Props> = ({
  register,
  label,
  extraText,
  state,
  setState,
  bubbleName,
  max,
  smaller,
  getValues,
  setValue,
}) => {
  const [error, setError] = useState<string>('');
  const { t } = useTranslation();

  const handleEnterPressed = (event: React.KeyboardEvent<HTMLFormElement>) => {
    if (event.key.toLowerCase() === 'enter') {
      let sel = state.selections;
      if (max && sel.length === max) {
        setError(`*${t('onboarding.you-are-already-at-your-max-of')} ${max}`);
      } else if (sel.includes(event.target.value)) {
        setError(
          `*${t('onboarding.already-exists-can-only-enter-unique-values')}`
        );
      } else if (event.target.value === '') {
        setError(`*${t('onboarding.cannot-input-a-blank-field')}`);
      } else {
        sel.push(event.target.value);
        setError('');
      }

      setState({
        selections: sel,
      });

      event.target.value = '';
    }
  };

  const buttonEnterPressed = () => {
    let sel = state.selections;
    let item = getValues(bubbleName);
    if (max && sel.length === max) {
      setError(`*${t('onboarding.you-are-already-at-your-max-of')} ${max}`);
    } else if (sel.includes(item)) {
      setError(
        `*${t('onboarding.already-exists-can-only-enter-unique-values')}`
      );
    } else if (item === '') {
      setError(`*${t('onboarding.cannot-input-a-blank-field')}`);
    } else {
      sel.push(item);
      setValue(bubbleName, '');
      setError('');
    }

    setState({
      selections: sel,
    });
  };

  const removeItem = (item: string) => {
    let sel = state.selections;
    sel = sel.filter((e: string) => e !== item);
    setError('');
    setState({
      selections: sel,
    });
  };

  const smallerClass = smaller
    ? 'mb-4 lg:mb-6 text-lg md:text-xl lg:text-2xl'
    : 'mb-12 text-xl md:text-5xl lg:text-7xl';

  return (
    <div className="flex flex-col">
      <Input
        type="text"
        register={register}
        label={label}
        extraText={extraText}
        name={bubbleName}
        placeholder={t('onboarding.enter-and-click-enter-to-add')}
        required={true}
        keydown={handleEnterPressed}
        smaller
        showAddButton
        addButtonOnClick={() => buttonEnterPressed()}
      />
      {error && (
        <div className="h-4 mb-6 ml-4 text-sm text-red-400 font-custom2">
          {error}
        </div>
      )}
      <div className="flex flex-wrap m-2">
        {state.selections.map((item: string) => {
          return (
            <div className={'flex ' + smallerClass} key={item}>
              <SelectButton
                checked={true}
                onClick={removeItem}
                item={item}
                smaller={smaller}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CheckBubbles;
