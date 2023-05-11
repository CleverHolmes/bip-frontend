import React, { useState } from 'react';
import resolveConfig from 'tailwindcss/resolveConfig';

import tailwindConfig from 'tailwind.config';
import Icon from 'components/new/Icon';
import type { IconNames } from 'components/new/Icon/icons';

const fullConfig = resolveConfig(tailwindConfig);

type ButtonProperties = {
  children?: React.ReactNode;
  size?: 'sm' | 'lg';
  variant?: 'primary' | 'secondary' | 'tertiary';
  disabled?: boolean;
  fullWidth?: boolean;
  onClick?: () => void;
  className?: string;
  iconBefore?: IconNames;
  iconAfter?: IconNames;
};

const Button: React.FC<ButtonProperties> = ({
  children,
  size = 'sm',
  variant = 'primary',
  disabled = false,
  onClick,
  className = '',
  iconBefore,
  iconAfter,
  fullWidth = false,
}) => {
  const [mouseOver, setMouseOver] = useState(false);

  const commonClasses = `inline-flex items-center justify-center ${
    !fullWidth ? "w-fit" : "w-full"
  } rounded-full cursor-pointer disabled:cursor-default bg-button ring-buttonOpactiy font-headings font-bold text-sm disabled:opacity-60`;
  const primaryClasses =
    " bg-blueN300 disabled:bg-blueN300 text-white hover:bg-blueN400 border-1 border-transparent";
  const secondaryClasses =
    " bg-white disabled:bg-white text-grayN500 hover:text-blueN300 hover:bg-blueN25 border-1 border-grayN500 hover:border-blueN300 ";
  const tertiaryClasses =
    " bg-blueN50 disabled:bg-blueN50 text-blueN300 hover:bg-blueN50 border-1 disabled:border-transparent hover:border-blueN300 ";

  const variantClasses =
    variant === "primary"
      ? primaryClasses
      : variant === "secondary"
      ? secondaryClasses
      : tertiaryClasses;
  const iconColor =
    variant === "primary"
      ? fullConfig.theme.colors.white
      : variant === "secondary"
      ? mouseOver
        ? fullConfig.theme.colors.blueN300
        : fullConfig.theme.colors.grayN500
      : fullConfig.theme.colors.blueN300;
  const iconName = variant === "primary" ? "Plus" : "Down";
  const buttonSize = size === "sm" ? " px-16 py-8 " : " px-24 py-12  ";
  // icon sizes are pretty much different as icon sizes sm for buttons should be xs and lg sm size
  const iconSize = size === "sm" ? "xs" : "sm";

  return (
    <button
      onClick={onClick}
      className={commonClasses + variantClasses + buttonSize + className}
      disabled={disabled}
      onMouseEnter={() => setMouseOver(true)}
      onMouseLeave={() => setMouseOver(false)}
    >
      {iconBefore && (
        <Icon
          className="mr-8"
          name={iconBefore}
          color={iconColor}
          size={iconSize}
          viewBox="0 0 16 16"
        />
      )}
      {children}
      {iconAfter && (
        <Icon
          className="ml-8"
          name={iconAfter}
          color={iconColor}
          size={iconSize}
          viewBox="0 0 16 16"
        />
      )}
    </button>
  );
};

export default Button;
