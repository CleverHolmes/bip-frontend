import React, { InputHTMLAttributes, useState } from "react";
import resolveConfig from "tailwindcss/resolveConfig";

import Icon from "components/new/Icon";
import type { IconNames } from "components/new/Icon/icons";
import tailwindConfig from "tailwind.config";

const fullConfig = resolveConfig(tailwindConfig);

export interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  showError?: boolean;
  error?: string;
  leftIcon?: IconNames;
  rightIcon?: IconNames;
  rightIconClick?: () => void;
  rightIconHide?: boolean;
  fullWidth?: boolean;
  type?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  helperText,
  showError = false,
  error,
  leftIcon,
  rightIcon,
  fullWidth,
  rightIconClick,
  rightIconHide,
  className,
  type,
  ...inputProps
}) => {
  const [mouseOver, setMouseOver] = useState(false);
  const commonClasses =
    "[&.input-field:not(:placeholder-shown)+label]:-top-2 [&.input-field:not(:placeholder-shown)+label]:left-16 [&.input-field:not(:placeholder-shown)+label]:text-xs " +
    "input-field font-bodyText text-sm px-16 border border-grayN100 shadow-box-iconButton rounded-xl active:border-blueN300 focus:outline-none focus:border-blueN300 w-full" +
    (mouseOver ? " text-grayN500 border-grayN500 " : " text-grayN200 ") +
    (showError ? " border-redN300 " : "") +
    (inputProps.disabled ? " border-grayN75 bg-grayN25 " : " bg-white ") +
    (leftIcon ? " pl-40 " : "") +
    (rightIcon ? " pr-40 " : "") +
    (label ? " placeholder:text-transparent " : "") +
    (type === "search" ? " py-8" : " py-12");

  const iconColor = mouseOver
    ? fullConfig.theme.colors.grayN500
    : fullConfig.theme.colors.grayN100;

  const textClasses =
    "font-bodyText text-xs text-grayN100 pointer-events-none cursor-text transition-all ease-in-out duration-300 bg-white" +
    (mouseOver ? " text-grayN500 " : "") +
    (leftIcon ? " left-40 " : " left-16 ") +
    (type === "search" ? " top-[0.5rem]" : " top-[0.875rem]");

  return (
    <div
      className={`${className} flex flex-col ${
        fullWidth ? "max-w-[100%] w-full" : "max-w-[20.75rem]"
      }`}
      onMouseEnter={() => setMouseOver(true)}
      onMouseLeave={() => setMouseOver(false)}
    >
      <div className="flex items-center relative">
        {leftIcon && (
          <Icon
            className="absolute left-16 top-[47%] transform -translate-y-1/2"
            name={leftIcon}
            color={iconColor}
            size="sm"
          />
        )}
        {rightIcon && !rightIconHide && (
          <Icon
            className="absolute right-16 top-[47%] transform -translate-y-1/2 cursor-pointer"
            name={rightIcon}
            color={iconColor}
            size="sm"
            onClick={rightIconClick}
          />
        )}
        <input className={commonClasses} placeholder=" " {...inputProps} />
        {label && (
          <label
            className={textClasses + " px-4 absolute"}
            htmlFor={inputProps?.name}
          >
            {label}
          </label>
        )}
      </div>
      {showError && error ? (
        <span className="font-bodyText text-xs text-redN300">{error}</span>
      ) : (
        <span className={textClasses}>{helperText}</span>
      )}
    </div>
  );
};

export default InputField;
