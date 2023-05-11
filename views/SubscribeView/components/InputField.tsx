import React, { InputHTMLAttributes, useState } from 'react';
import resolveConfig from 'tailwindcss/resolveConfig';

import Icon from './Icon';
import { IconNames } from './Icon/icons';
import tailwindConfig from 'tailwind.config';

const fullConfig = resolveConfig(tailwindConfig);

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: IconNames;
  rightIcon?: IconNames;
  fullWidth?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  helperText,
  error,
  leftIcon,
  rightIcon,
  fullWidth,
  ...inputProps
}) => {
  const [mouseOver, setMouseOver] = useState(false);
  const commonClasses =
    '[&.input-field:not(:placeholder-shown)+label]:-top-2 [&.input-field:not(:placeholder-shown)+label]:left-[1rem] [&.input-field:not(:placeholder-shown)+label]:text-sm ' +
    'input-field cursor-text font-bodyText text-base py-[0.75rem] px-[1rem] border border-grayN100 shadow-box-iconButton rounded-xl active:border-blueN300 focus:outline-none focus:border-blueN300 w-full mb-[0.25rem]' +
    (mouseOver ? ' text-grayN500 border-grayN500 ' : ' text-grayN100 ') +
    (error ? ' border-redN300 ' : '') +
    (inputProps.disabled ? ' border-grayN75 bg-grayN25 ' : ' bg-white ') +
    (leftIcon ? ' pl-[2.5rem] ' : '') +
    (rightIcon ? ' pr-[2.5rem] ' : '') +
    (label ? ' placeholder:text-transparent ' : '');

  const iconColor = mouseOver
    ? fullConfig.theme.colors.grayN500
    : fullConfig.theme.colors.grayN100;

  const textClasses =
    'top-[0.875rem] font-bodyText text-base text-grayN100 pointer-events-none cursor-text transition-all ease-in-out duration-300 bg-white' +
    (mouseOver ? ' text-grayN500 ' : '') +
    (leftIcon ? ' left-[2.5rem] ' : ' left-[1rem] ');

  return (
    <div
      className={`flex flex-col ${
        fullWidth ? 'max-w-[100%] w-full' : 'max-w-[20.75rem]'
      }`}
      onMouseEnter={() => setMouseOver(true)}
      onMouseLeave={() => setMouseOver(false)}
    >
      <div className="flex items-center relative">
        {leftIcon && (
          <Icon
            className="absolute left-[1rem] top-0 bottom-[0.35rem] m-auto"
            name={leftIcon}
            color={iconColor}
            size="sm"
          />
        )}
        {rightIcon && (
          <Icon
            className="absolute right-[1rem] top-1/2 transform -translate-y-1/2"
            name={rightIcon}
            color={iconColor}
            size="sm"
          />
        )}
        <input className={commonClasses} placeholder=" " {...inputProps} />
        {label && (
          <label
            className={textClasses + ' px-4 absolute'}
            htmlFor={inputProps?.name}
          >
            {label}
          </label>
        )}
      </div>
      {error ? (
        <span className="font-bodyText text-sm text-redN300">{error}</span>
      ) : (
        <span className={textClasses}>{helperText}</span>
      )}
    </div>
  );
};

export default InputField;
