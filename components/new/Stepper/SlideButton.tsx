import React from 'react';
import classnames from 'classnames';

export const SlideButton: React.FC<{
  onClick: () => void;
  disabled: boolean;
  children: React.ReactNode;
  className?: string;
}> = ({ onClick, disabled, children, className }) => (
  <button
    className={classnames(
      'md:hidden w-28 h-28 absolute inset-y-auto rounded-full bg-white shadow-md border-1 flex items-center justify-center',
      className,
      {
        'text-grayN100': disabled,
      }
    )}
    onClick={onClick}
    disabled={disabled}
  >
    {children}
  </button>
);
