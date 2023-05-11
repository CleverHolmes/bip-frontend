import React, { ReactNode, useState } from 'react';
import resolveConfig from 'tailwindcss/resolveConfig';

import tailwindConfig from 'tailwind.config';
import Icon from 'components/new/Icon';

const fullConfig = resolveConfig(tailwindConfig);

type ChipProperties = {
  className?: string;
  variant?: 'primary' | 'light';
  selected?: boolean;
  label: string;
  children?: ReactNode;
  removable?: boolean;
  annexable?: boolean;
  onClick?: (e?: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void;
  noWrap?: boolean;
};

const Chip: React.FC<ChipProperties> = ({
  className,
  variant = 'primary',
  selected = false,
  label,
  children,
  removable = false,
  annexable = true,
  onClick,
  noWrap,
}) => {
  const [mouseOver, setMouseOver] = useState(false);
  const commonClasses =
    'flex flex-row items-center justify-center rounded-full p-8 cursor-pointer w-max font-bodyText text-sm transition-colors ease-in-out select-none min-w-[2.75rem] ' +
    (selected
      ? variant === 'light'
        ? 'bg-blueN50 hover:bg-blueN25 text-blueN300 hover:text-blueN200 '
        : 'bg-blueN300 hover:bg-blueN400 text-white '
      : 'bg-grayN50 hover:bg-blueN50 hover:text-blueN300 ' +
        (variant === 'light' ? 'text-grayN100 ' : 'text-grayN300 ')) +
    (noWrap ? 'whitespace-nowrap ' : '') +
    className;
  const iconColor = selected
    ? fullConfig.theme.colors.white
    : mouseOver
    ? fullConfig.theme.colors.blueN300
    : fullConfig.theme.colors.grayN300;

  return (
    <span
      className={commonClasses}
      onClick={onClick}
      onMouseEnter={() => setMouseOver(true)}
      onMouseLeave={() => setMouseOver(false)}
    >
      {label}
      {selected && removable ? (
        <Icon className="ml-4" name="Close" size="sm" color={iconColor} />
      ) : (
        annexable && (
          <Icon className="ml-4" name="Plus" size="sm" color={iconColor} />
        )
      )}
      {!!children && <>{children}</>}
    </span>
  );
};

export default Chip;
