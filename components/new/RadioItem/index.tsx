import React, { FC } from 'react';
import { UseFormRegister } from 'react-hook-form';

type Props = {
  register?: UseFormRegister<any>;
  checked?: boolean;
  value?: string;
  name: string;
  label: string | React.ReactNode;
  onChange?: (item: string) => void;
  size?: 'sm' | 'lg';
};

const RadioItem: FC<Props> = ({
  register,
  checked,
  value,
  label,
  name,
  onChange,
  size = 'sm',
}) => {
  let radioClassName =
    'border rounded cursor-pointer text-button border-inputGray accent-button hover:bg-inputGray focus:ring-button';
  let textClassName = 'ml-2 font-medium font-custom1';

  if (size === 'sm') {
    radioClassName +=
      ' !w-4 !h-4 hover:!w-4 hover:!h-4 before:!h-[10px] before:!w-[10px] before:!m-[2px]';
    textClassName += ' text-sm';
  } else if (size === 'lg') {
    radioClassName +=
      ' !w-8 !h-8 hover:!w-8 hover:!h-8 before:!h-[22px] before:!w-[22px] before:!m-[4px]';
    textClassName += ' text-lg sm:text-xl lg:text-2xl';
  }

  return (
    <div className="flex items-center">
      {!register && (
        <input
          type="radio"
          checked={checked}
          onChange={() => onChange && onChange(name)}
          name={name}
          id={value}
          className={radioClassName}
        />
      )}
      {register && (
        <input
          {...register(name)}
          value={value}
          type="radio"
          id={value}
          className={radioClassName}
        />
      )}
      <label htmlFor={value} className={textClassName}>
        {label}
      </label>
    </div>
  );
};

export default RadioItem;
