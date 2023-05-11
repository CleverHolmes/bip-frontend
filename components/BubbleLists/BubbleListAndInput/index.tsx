import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { UseFormRegister, FieldValues } from 'react-hook-form';

import Input from 'components/Input';
import SelectButton from 'components/Buttons/SelectButton';
import HeaderSplitPrimaryButton from 'components/HeaderSplitPrimaryButton';

type Props = {
  checkList: any[];
  checkList2: any[];
  label?: string;
  bubbleName: string;
  register: UseFormRegister<FieldValues>;
  defaultValue: string[];
  state: any;
  setState: any;
  children?: React.ReactNode;
  smaller?: boolean;
  getValues?: any;
  setValue?: any;
};

const BubbleListAndInput: React.FC<Props> = ({
  label,
  checkList,
  state,
  setState,
  smaller,
  register,
  bubbleName,
  checkList2,
  getValues,
  setValue,
}) => {
  const toggleEvent = (item: string) => {
    let sel = state.selections;
    if (sel.includes(item)) {
      sel = sel.filter((e: string) => e !== item);
    } else {
      sel.push(item);
    }
    setState({
      selections: sel,
    });
  };

  const smallerClass = smaller ? 'mb-4 lg:mb-6' : 'mb-12';
  const smallerMargin = smaller ? 'mb-8 ' : 'mb-16 ';
  const { t } = useTranslation();
  const [error, setError] = useState<string>('');

  const isAllSelected = state.selections.length === checkList.length;

  const handleEnterPressed = (event: React.KeyboardEvent<HTMLFormElement>) => {
    if (event.key.toLowerCase() === 'enter') {
      let sel = state.selections;
      if (sel.includes(event.target.value)) {
        setError(
          `*${t('onboarding.already-exists-can-only-enter-unique-values')}`
        );
      } else {
        sel.push(event.target.value);
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
    if (sel.includes(item)) {
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

  const selectAllItems = () => {
    checkList.map((item) => {
      let found: any;
      found = state.selections.some(
        (selectedItem: string) => selectedItem === item.value
      );
      if (!found) toggleEvent(item.value);
    });
  };

  const selectNoneItems = () => {
    setState({
      selections: [],
    });
  };

  return (
    <div className="flex flex-col">
      <label
        className={
          smallerMargin +
          'flex items-center text-lg font-bold font-custom1 md:text-xl lg:text-2xl'
        }
      >
        {!!label && <HeaderSplitPrimaryButton label={label} />}
        <div
          className={
            'font-normal ml-2 underline rounded-full flex justify-center items-center text-base text-inputGray hover:text-button cursor-pointer '
          }
          onClick={() => (isAllSelected ? selectNoneItems() : selectAllItems())}
        >
          {isAllSelected ? t('select_none') : t('select_all')}
        </div>
      </label>
      <div className="flex flex-wrap mb-4">
        {checkList.map((item: any, index: number) => {
          return (
            <div key={item.value}>
              <div className={smallerClass}>
                <SelectButton
                  checked={
                    state.selections.filter((e: string) => e === item.value)
                      .length === 1
                  }
                  onClick={toggleEvent}
                  item={item.value}
                  smaller={smaller}
                />
              </div>
            </div>
          );
        })}
      </div>
      <Input
        type="text"
        register={register}
        name={bubbleName}
        placeholder={t('onboarding.enter-and-click-enter-to-add')}
        required={true}
        keydown={handleEnterPressed}
        smaller
        showAddButton
        addButtonOnClick={() => buttonEnterPressed()}
      />
      <div className="flex flex-wrap">
        {filterArray(state.selections, checkList2).map((item: any) => {
          return (
            <div className="mb-4 lg:mb-6" key={item}>
              <SelectButton
                checked
                onClick={toggleEvent}
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

const filterArray = (arr1: string[], arr2: string[]) => {
  const filtered = arr1.filter((el) => {
    return arr2.indexOf(el) === -1;
  });
  return filtered;
};

export default BubbleListAndInput;
