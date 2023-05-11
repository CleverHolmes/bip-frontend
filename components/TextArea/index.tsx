import { useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { useTranslation } from 'next-i18next';

import ForwardButton from 'components/ForwardButton';
import Icon from 'components/Icon';
import HeaderSplitPrimaryButton from 'components/HeaderSplitPrimaryButton';

interface InputProps {
  name: string;
  label?: string;
  labelEmphasis?: string;
  placeholder: string;
  value: string;
  enterMessage?: boolean;
  showForwardButton?: boolean;
  onChange?: any;
  onSubmit?: () => void;
  smaller?: boolean;
  max?: number;
}

const TextArea: React.FC<InputProps> = ({
  placeholder,
  name,
  label,
  labelEmphasis,
  enterMessage,
  value,
  showForwardButton,
  onChange,
  onSubmit,
  smaller,
  max,
}) => {
  const [focused, setFocused] = useState(false);
  const onFocus = () => setFocused(true);
  const onBlur = () => setFocused(false);
  const { t } = useTranslation();

  const textSize =
    value && value.length > 100
      ? ' text-base md:text-3xl lg:text-5xl'
      : ' text-xl md:text-5xl lg:text-7xl';

  const smallerText =
    value && value.length > 100
      ? ' text-base md:text-xl lg:text-2xl'
      : ' text-xl md:text-2xl lg:text-3xl';

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
        <div className="flex items-center justify-between">
          <TextareaAutosize
            name={name}
            placeholder={placeholder}
            className={
              'block w-full pb-1 appearance-none focus:outline-none bg-transparent placeholder-inputGray ' +
              (smaller ? smallerText : textSize)
            }
            onFocus={onFocus}
            onBlur={onBlur}
            onChange={onChange}
            value={value}
            id="textarea"
            maxLength={max}
          />
          {showForwardButton && <ForwardButton onClick={onSubmit} />}
        </div>
      </div>
      <div className="flex justify-end h-6">
        {enterMessage && value && value.length > 0 && focused && (
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

export default TextArea;
