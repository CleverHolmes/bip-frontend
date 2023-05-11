import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { UseFormRegister, FieldValues } from 'react-hook-form';

import ForwardButton from 'components/ForwardButton';
import Icon from 'components/Icon';
import HeaderSplitPrimaryButton from 'components/HeaderSplitPrimaryButton';

interface InputProps {
  name: string;
  label?: string;
  type: 'text' | 'email' | 'number';
  register: any;
  required: boolean;
  onChange?: (str: string) => void;
  placeholder: string;
  watchedValue?: string;
  keydown?: any;
  enterMessage?: boolean;
  showForwardButton?: boolean;
  defaultValue?: string;
}

const InputPlain: React.FC<InputProps> = ({
  onChange,
  placeholder,
  name,
  label,
  register,
  required,
  type,
  keydown,
  enterMessage,
  watchedValue,
  showForwardButton,
  defaultValue,
  ...rest
}) => {
  const [focused, setFocused] = useState(false);
  const onFocus = () => setFocused(true);
  const onBlur = () => setFocused(false);
  const { t } = useTranslation();

  return (
    <div className="flex flex-col">
      <div className="relative flex flex-col font-bold border-b-2 border-borderColor focus-within:border-button font-custom1">
        {!!label && (
          <label
            htmlFor={name}
            className="block mb-8 text-lg md:text-xl lg:text-2xl"
          >
            <HeaderSplitPrimaryButton label={label} />
          </label>
        )}

        <div className="flex items-center justify-between pb-1">
          <input
            {...(register && register(name, required))}
            type={type}
            name={name}
            placeholder={placeholder}
            className="block w-full px-3 text-xl bg-transparent appearance-none cursor-pointer focus:outline-none placeholder-inputGray md:text-5xl lg:text-7xl"
            onKeyDown={keydown}
            onFocus={onFocus}
            onBlur={onBlur}
            defaultValue={defaultValue}
          />
          {showForwardButton && <ForwardButton />}
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
    </div>
  );
};

export default InputPlain;
