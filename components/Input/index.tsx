import React, { useState } from 'react';
import { NumericFormat, NumberFormatValues } from 'react-number-format';
import { useTranslation } from 'next-i18next';
import { UseFormSetValue } from 'react-hook-form';

import ForwardButton from 'components/ForwardButton';
import AddButton from 'components/Buttons/AddButton';
import Icon from 'components/Icon';
import HeaderSplitPrimaryButton from 'components/HeaderSplitPrimaryButton';

interface InputProps {
  name: string;
  label?: string;
  labelOld?: string;
  labelOldEmphasis?: string;
  type: 'text' | 'email' | 'number' | 'password';
  prefix?: string;
  suffix?: string;
  extraText?: string;
  errorText?: string;
  register: any;
  required: boolean;
  onChange?: (str: string) => void;
  placeholder: string;
  watchedValue?: any;
  keydown?: any;
  enterMessage?: boolean;
  showForwardButton?: boolean;
  defaultValue?: string;
  smaller?: boolean;
  showAddButton?: boolean;
  disablePaste?: boolean;
  thousandSeparator?: string;
  decimalScale?: number;
  maxLength?: number;
  setValue?: UseFormSetValue<any>;
  addButtonOnClick?: () => void;
  isAllowed?: (values: NumberFormatValues) => boolean;
}

const Input: React.FC<InputProps> = ({
  placeholder,
  name,
  label,
  labelOld,
  labelOldEmphasis,
  register,
  required,
  type,
  keydown,
  enterMessage,
  watchedValue,
  showForwardButton,
  defaultValue,
  smaller,
  prefix,
  suffix,
  extraText,
  errorText,
  showAddButton,
  disablePaste,
  thousandSeparator = ',',
  decimalScale = 3,
  setValue,
  addButtonOnClick,
  isAllowed,
  maxLength = 70,
}) => {
  const [focused, setFocused] = useState(false);
  const onFocus = () => setFocused(true);
  const onBlur = () => setFocused(false);
  const isNumber = type === 'number';
  const { t } = useTranslation();

  const smallerClass = smaller
    ? 'placeholder:text-lg leading-9 text-xl md:text-2xl placeholder:md:text-2xl lg:text-2xl placeholder:lg:text-2xl h-8'
    : 'placeholder:text-lg text-xl md:text-5xl placeholder:md:text-5xl lg:text-7xl placeholder:lg:text-7xl';

  const preventCopyPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    if (disablePaste) e.preventDefault();
  };

  return (
    <div className="flex flex-col">
      <div className="relative flex flex-col font-bold border-b-4 border-borderColor focus-within:border-button font-custom1">
        {label && (
          <label
            htmlFor={name}
            className="block mb-8 text-lg md:text-xl lg:text-2xl"
          >
            <HeaderSplitPrimaryButton label={label} />
            <span className="ml-2 text-base font-normal text-inputGray lg:text-lg">
              {extraText && `(${extraText})`}
            </span>
          </label>
        )}
        {/* FIX THIS LATER NEED TO MAKE LABEL FOR CUSTOM INFO */}
        {labelOld && labelOldEmphasis && (
          <label
            htmlFor={name}
            className="block mb-8 text-lg md:text-xl lg:text-2xl"
          >
            <span className="text-primary">{labelOld}</span>
            <span className="text-button">{labelOldEmphasis}</span>
            <span className="ml-2 text-base font-normal text-inputGray lg:text-lg">
              {extraText && `(${extraText})`}
            </span>
          </label>
        )}
        <div className="flex items-end justify-between mb-1">
          {!isNumber && (
            <input
              {...(register && register(name, required))}
              maxLength={maxLength}
              type={type}
              name={name}
              placeholder={placeholder}
              className={
                'block w-full appearance-none focus:outline-none bg-transparent placeholder-inputGray cursor-pointer p-0 ' +
                smallerClass
              }
              onKeyDown={keydown}
              onFocus={onFocus}
              onBlur={onBlur}
              defaultValue={defaultValue}
              onPaste={(e) => preventCopyPaste(e)}
            />
          )}
          {isNumber && (
            <NumericFormat
              name={name}
              placeholder={placeholder}
              className={
                'block w-full appearance-none focus:outline-none bg-transparent placeholder-inputGray cursor-pointer ' +
                smallerClass
              }
              prefix={prefix}
              suffix={suffix}
              decimalScale={decimalScale}
              decimalSeparator="."
              thousandsGroupStyle="thousand"
              thousandSeparator={thousandSeparator}
              allowNegative={false}
              onKeyDown={keydown}
              onFocus={onFocus}
              onBlur={onBlur}
              defaultValue={defaultValue}
              onValueChange={(values) => {
                setValue &&
                  setValue(name, values.value, { shouldValidate: true });
              }}
              isAllowed={isAllowed}
            />
          )}
          {showForwardButton && <ForwardButton />}
          {showAddButton && <AddButton onClick={addButtonOnClick} />}
        </div>
      </div>
      <div className="flex justify-end h-6">
        {enterMessage && watchedValue && watchedValue.length > 0 && focused && (
          <div className="flex items-center mt-1">
            <div className="text-sm font-custom2 text-primary sm:text-lg">
              {t('hit-enter-to-next')}
            </div>
            <Icon
              name="NextLine"
              className="ml-2 cursor-pointer fill-primary"
              viewBox="0 0 18 18"
              size="16"
            />
          </div>
        )}
      </div>
      {errorText && (
        <div className="h-4 mb-2 ml-4 text-sm text-red-400 font-custom2">
          *{errorText}
        </div>
      )}
    </div>
  );
};

export default Input;
