import { useState, ChangeEvent } from 'react';

import HeaderSplitPrimaryButton from 'components/HeaderSplitPrimaryButton';

interface InputProps {
  name: string;
  label?: string;
  type: 'text' | 'email' | 'number' | 'password';
  onChange1: any;
  onChange2: any;
  value1: any;
  value2: any;
  placeholder1: string;
  placeholder2: string;
  smaller?: boolean;
}

const InputDoubleNoRegisterColumn: React.FC<InputProps> = ({
  placeholder1,
  placeholder2,
  name,
  label,
  onChange1,
  value1,
  onChange2,
  value2,
  type,
  smaller,
}) => {
  const [focused, setFocused] = useState(false);
  const onFocus = () => setFocused(true);
  const onBlur = () => setFocused(false);

  const smallerClass = smaller
    ? 'text-xl md:text-2xl lg:text-3xl'
    : 'text-xl md:text-5xl lg:text-7xl';
  const maxLength = 70;

  const handleChange1 = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (value.length <= maxLength) {
      onChange1(event);
    }
  };
  const handleChange2 = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (value.length <= maxLength) {
      onChange2(event);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="relative flex flex-col font-bold font-custom1">
        {!!label && (
          <label
            htmlFor={name}
            className="block mb-8 text-lg md:text-xl lg:text-2xl"
          >
            <HeaderSplitPrimaryButton label={label} />
          </label>
        )}
        <div className="flex items-center justify-between pb-1 mb-8 border-b-4 border-borderColor focus-within:border-button">
          <input
            type={type}
            name={name}
            placeholder={placeholder1}
            className={
              'block w-full appearance-none focus:outline-none bg-transparent placeholder-inputGray cursor-pointer ' +
              smallerClass
            }
            value={value1}
            onFocus={onFocus}
            onBlur={onBlur}
            onChange={handleChange1}
          />
        </div>
        <div className="flex items-center justify-between pb-1 border-b-4 border-borderColor focus-within:border-button">
          <input
            type={type}
            name={name}
            placeholder={placeholder2}
            className={
              'block w-full appearance-none focus:outline-none bg-transparent placeholder-inputGray cursor-pointer ' +
              smallerClass
            }
            value={value2}
            onFocus={onFocus}
            onBlur={onBlur}
            onChange={handleChange2}
          />
        </div>
      </div>
    </div>
  );
};

export default InputDoubleNoRegisterColumn;
