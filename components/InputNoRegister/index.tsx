import {ChangeEvent, useState} from 'react';

import HeaderSplitPrimaryButton from 'components/HeaderSplitPrimaryButton';

interface InputProps {
  name: string;
  label?: string;
  type: 'text' | 'email' | 'number' | 'password';
  onChange: any;
  placeholder: string;
  smaller?: boolean;
  value?: any;
}

const InputNoRegister: React.FC<InputProps> = ({
  placeholder,
  name,
  label,
  onChange,
  type,
  smaller,
  value,
}) => {
  const [focused, setFocused] = useState(false);
  const onFocus = () => setFocused(true);
  const onBlur = () => setFocused(false);
  const maxLength = 70;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (value.length <= maxLength) {
      onChange(event);
    }
  };

  const smallerClass = smaller
    ? 'text-xl md:text-2xl lg:text-3xl'
    : 'text-xl md:text-5xl lg:text-7xl';

  return (
    <div className="flex flex-col">
      <div className="relative flex flex-col font-bold border-b-4 border-borderColor focus-within:border-button font-custom1">
        {!!label && (
          <label
            htmlFor={name}
            className="block mb-8 text-lg md:text-xl lg:text-2xl"
          >
            <HeaderSplitPrimaryButton label={label} />
          </label>
        )}
        <div className="flex items-center justify-between mb-1">
          <input
            type={type}
            name={name}
            placeholder={placeholder}
            className={
              'block w-full appearance-none focus:outline-none bg-transparent placeholder-inputGray cursor-pointer ' +
              smallerClass
            }
            value={value}
            onFocus={onFocus}
            onBlur={onBlur}
            onChange={handleChange}
            onWheel={() =>
              type === 'number'
                ? (document.activeElement as HTMLElement).blur()
                : null
            }
          />
        </div>
      </div>
    </div>
  );
};

export default InputNoRegister;
