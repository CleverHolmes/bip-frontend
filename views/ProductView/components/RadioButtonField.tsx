import React from 'react';
import { UseFormRegister } from 'react-hook-form';

import HeaderSplitPrimaryButton from 'components/HeaderSplitPrimaryButton';
import RadioItem from 'components/new/RadioItem';

interface Props {
  register: UseFormRegister<any>;
  isVertical?: boolean;
  name?: string;
  label?: string;
  items: { label: string | React.ReactNode; value: string }[];
  onChange?: () => void;
  errorText?: string;
}

const RadioButtonField: React.FC<Props> = ({
  register,
  isVertical,
  label,
  name,
  items,
  errorText,
}) => {
  return (
    <div className="flex flex-col">
      <label className="block mb-8 text-lg font-bold font-custom1 md:text-xl lg:text-2xl">
        {!!label && <HeaderSplitPrimaryButton label={label} />}
      </label>
      <div className={`flex ${isVertical ? 'flex-col gap-6' : 'flex-row gap-4'}`}>
        {items.map((item) => {
          return (
            <div key={item.value}>
              <RadioItem
                register={register}
                name={name || item.value}
                label={item.label}
                value={item.value}
                size="lg"
              />
            </div>
          );
        })}
      </div>
      {errorText && (
        <div className="h-4 mt-6 mb-2 ml-4 text-sm text-red-400 font-custom2">
          *{errorText}
        </div>
      )}
    </div>
  );
};

export default RadioButtonField;
