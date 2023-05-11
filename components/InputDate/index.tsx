import 'react-datepicker/dist/react-datepicker.css';
import React, { useRef } from 'react';
import DatePicker from 'react-datepicker';

import Icon from 'components/Icon';
import HeaderSplitPrimaryButton from 'components/HeaderSplitPrimaryButton';

interface InputProps {
  name: string;
  label?: string;
  onChange?: (str: string) => void;
  startDate: any;
  setStartDate: any;
  extraText?: string;
}

/* eslint-disable react/display-name */
const CustomInput = (
  props: React.HTMLProps<HTMLInputElement>,
  ref: React.Ref<HTMLInputElement>
) => (
  <input
    {...props}
    className="w-full text-xl font-bold border-b-2 cursor-pointer md:text-2xl lg:text-3xl border-borderColor focus-within:border-button font-custom1 text-inputGray"
    placeholder={props.value ? `${props.value}` : `Select a date`}
    ref={ref}
  />
);

const InputDate: React.FC<InputProps> = ({
  name,
  label,
  startDate,
  setStartDate,
  extraText,
}) => {
  const ref = useRef();

  return (
    <div className="flex flex-col">
      <div className="relative flex flex-col font-bold border-b-2 border-borderColor focus-within:border-button font-custom1">
        {!!label && (
          <label
            htmlFor={name}
            className="block mb-8 text-lg md:text-xl lg:text-2xl"
          >
            {!!label && <HeaderSplitPrimaryButton label={label} />}
            <span className="ml-2 text-base font-normal text-inputGray lg:text-lg">
              {extraText && `(${extraText})`}
            </span>
          </label>
        )}
        <div className="flex items-center justify-between">
          <DatePicker
            selected={startDate}
            onChange={(date: any) => setStartDate(date)}
            customInput={React.createElement(React.forwardRef(CustomInput))}
          />
          <Icon
            name="Calendar"
            className="mr-8 fill-primary"
            viewBox="0 0 20 22"
            size="18"
          />
        </div>
      </div>
    </div>
  );
};

export default InputDate;
