import React from 'react';
import classNames from 'classnames';

type CardProperties = React.HTMLAttributes<HTMLDivElement> & {
  isFull?: boolean;
  selectNone?: boolean;
};

const Card: React.FC<CardProperties> = ({
  className,
  children,
  isFull,
  selectNone,
  ...divProps
}) => (
  <div
    className={classNames(
      'shadow-lg rounded-xl p-16',
      { 'w-full': isFull },
      { 'select-none': selectNone },
      className
    )}
    {...divProps}
  >
    {children}
  </div>
);

export default Card;
