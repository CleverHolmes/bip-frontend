import { useState } from 'react';
import { NumericFormat } from 'react-number-format';

import HeaderSplitPrimaryButton from 'components/HeaderSplitPrimaryButton';

interface InputProps {
  name: string;
  label?: string;
  label1?: string;
  label2?: string;
  type: 'text' | 'email' | 'number' | 'password';
  labelAddition?: string;
  onChange1: any;
  onChange2: any;
  placeholder: string;
  smaller?: boolean;
  modal?: boolean;
  extraText?: string;
  defaultValue1?: any;
  defaultValue2?: any;
}

const InputNoRegister: React.FC<InputProps> = ({
  placeholder,
  name,
  label1,
  label2,
  label,
  labelAddition,
  onChange1,
  onChange2,
  smaller,
  modal,
  defaultValue1,
  defaultValue2,
  extraText,
}) => {
  const [focused, setFocused] = useState(false);
  const onFocus = () => setFocused(true);
  const onBlur = () => setFocused(false);

  const smallerClass = smaller
    ? 'text-xl md:text-2xl lg:text-3xl'
    : 'text-xl md:text-5xl lg:text-7xl';

  const nonModal = !modal && 'sm:justify-start sm:flex-row';
  const modalSpacing = modal ? 'mt-10' : '';
  return (
    <div className="flex flex-col">
      <div className="font-bold ">
        <div className="block mb-8 text-lg md:text-xl lg:text-2xl">
          {!!label && <HeaderSplitPrimaryButton label={label} />}
          {labelAddition && (
            <span className="ml-2 text-base text-inputGray">
              {labelAddition}
            </span>
          )}
          <span className="ml-2 text-base font-normal text-inputGray lg:text-lg">
            {extraText && `(${extraText})`}
          </span>
        </div>
        <div
          className={'flex flex-col items-center justify-center ' + nonModal}
        >
          <div className="relative flex flex-row items-center border-b-4 border-borderColor focus-within:border-button font-custom1">
            <div className="ml-4 mr-4">{label2}</div>
            <NumericFormat
              name={name}
              placeholder={placeholder}
              className={
                'pb-1 block w-full appearance-none focus:outline-none bg-transparent placeholder-inputGray cursor-pointer ' +
                smallerClass
              }
              decimalScale={2}
              decimalSeparator="."
              thousandsGroupStyle="thousand"
              thousandSeparator=","
              allowNegative={false}
              onFocus={onFocus}
              onBlur={onBlur}
              onChange={onChange2}
              defaultValue={defaultValue1}
            />
          </div>
          <div
            className={
              'relative flex flex-row items-center border-b-4 border-borderColor focus-within:border-button font-custom1 ' +
              modalSpacing
            }
          >
            <NumericFormat
              name={name}
              placeholder={placeholder}
              className={
                'pb-1 block w-full appearance-none focus:outline-none bg-transparent placeholder-inputGray cursor-pointer ' +
                smallerClass
              }
              onFocus={onFocus}
              decimalScale={2}
              decimalSeparator="."
              thousandsGroupStyle="thousand"
              thousandSeparator=","
              allowNegative={false}
              onBlur={onBlur}
              onChange={onChange1}
              defaultValue={defaultValue2}
            />
            <div className="mr-4">{label1}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InputNoRegister;
