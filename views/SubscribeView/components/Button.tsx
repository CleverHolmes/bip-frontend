import React from 'react';
import resolveConfig from 'tailwindcss/resolveConfig';

import Icon from './Icon';
import type { IconNames } from './Icon/icons';
import tailwindConfig from 'tailwind.config';

const fullConfig = resolveConfig(tailwindConfig);

type ButtonProperties = {
  children?: React.ReactNode;
  size?: 'sm' | 'lg';
  variant?: 'primary' | 'secondary' | 'tertiary' | 'link';
  disabled?: boolean;
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
  className,
  iconBefore,
  iconAfter,
}) => {
  const commonClasses = `inline-flex items-center justify-center w-fit rounded-full ${
    !disabled ? 'cursor-pointer' : ''
  } ring-buttonOpactiy font-headings font-bold text-sm disabled:opacity-60`;
  const primaryClasses = ` bg-blueN300 text-white ${
    !disabled ? 'hover:bg-blueN400' : ''
  }`;
  const secondaryClasses =
    ' bg-white text-grayN500 hover:bg-grayN50 border-1 border-grayN500 ';
  const tertiaryClasses =
    ' bg-blueN50 text-blueN300 hover:bg-blueN50 hover:border-1 hover:border-blueN300 ';
  // const expandedClasses = isExpanded ? ' bg-grayN50 ' : '';
  const variantClasses =
    variant === 'primary'
      ? primaryClasses
      : variant === 'secondary'
      ? secondaryClasses
      : tertiaryClasses;
  const anchorClasses = ' bg-transparent text-blueN300 p-0 font-bodyText ';
  const iconColor =
    variant === 'primary'
      ? fullConfig.theme.colors.white
      : variant === 'secondary'
      ? fullConfig.theme.colors.grayN500
      : fullConfig.theme.colors.blueN300;
  const iconName = variant === 'primary' ? 'Plus' : 'Down';
  const buttonSize =
    size === 'sm' ? ' px-[1rem] py-[0.5rem] ' : ' px-[1.5rem] py-[0.75rem]  ';
  // icon sizes are pretty much different as icon sizes sm for buttons should be xs and lg sm size
  const iconSize = size === 'sm' ? 'xs' : 'sm';

  return (
    <button
      onClick={onClick}
      className={
        variant === 'link'
          ? anchorClasses + className
          : commonClasses + variantClasses + buttonSize + className
      }
      disabled={disabled}
    >
      {iconBefore && (
        <Icon
          className="mr-[0.5rem]"
          name={iconBefore}
          color={iconColor}
          size={iconSize}
        />
      )}
      {children}
      {iconAfter && (
        <Icon
          className="ml-[0.5rem]"
          name={iconAfter}
          color={iconColor}
          size={iconSize}
        />
      )}
    </button>
  );
};

export default Button;
