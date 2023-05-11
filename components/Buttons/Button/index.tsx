import React from 'react';

import Icon, { IconNames } from 'components/Icon';

interface Props {
  children?: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  icon?: IconNames;
  smaller?: boolean;
  className?: string;
  viewBox?: string;
  disabled?: boolean;
  color?: string;
}

const Button: React.FC<Props> = ({
  children,
  onClick,
  icon,
  smaller,
  className,
  viewBox,
  disabled,
  color,
}) => {
  const buttonSize = smaller
    ? 'py-2 px-4 font-custom2 text-lg '
    : 'py-3.5  w-56 sm:w-72 font-bold font-custom1 text-xl ';

  const colorClass =
    color === 'yellow'
      ? ' bg-yellow hover:bg-yellowButtonHover focus:bg-yellowButtonHover focus:ring-yellow/50 active:bg-yellowButtonHover disabled:bg-yellowDisabled '
      : color === 'blue2'
      ? ' bg-button/50 hover:bg-buttonHover2/50 focus:bg-buttonHover2/50 focus:ring-button/25 active:bg-buttonHover2/50 disabled:bg-buttonDisabled '
      : color === 'orange'
      ? ' bg-orange hover:bg-orangeButtonHover focus:bg-orangeButtonHover focus:ring-orange/50 active:bg-orangeButtonHover disabled:bg-orange/20'
      : ' bg-button hover:bg-buttonHover2 focus:bg-buttonHover2 focus:ring-button/50 active:bg-buttonHover2 disabled:bg-buttonDisabled ';
  return (
    <button
      onClick={onClick}
      className={
        buttonSize +
        ' rounded-full text-white flex justify-center items-center cursor-pointer  hover:shadow-lg  focus:shadow-lg focus:outline-none focus:ring  active:shadow-lg transition duration-150 ease-in-out disabled:cursor-not-allowed disabled:shadow-none' +
        colorClass +
        className
      }
      disabled={disabled}
    >
      {icon && (
        <Icon
          name={icon}
          className={`${children ? 'mr-2' : ''} fill-white`}
          viewBox={viewBox}
        />
      )}
      {children}
    </button>
  );
};

export default Button;
