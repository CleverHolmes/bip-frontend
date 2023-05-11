import React from 'react';
import classnames from 'classnames';
import resolveConfig from 'tailwindcss/resolveConfig';

import Icon from '../Icon';
import tailwindConfig from 'tailwind.config';

const fullConfig = resolveConfig(tailwindConfig);

type AlertProps = {
  children: React.ReactNode;
  className?: string;
  severity?: 'error';
};

const Alert: React.FC<AlertProps> = ({
  className,
  children,
  severity = 'error',
}) => {
  const getColor = () => {
    switch (severity) {
      case 'error':
        return fullConfig.theme.colors.redN400;
      default:
        return fullConfig.theme.colors.grayN100;
    }
  };

  return (
    <div
      className={classnames(
        'inline-flex justify-start gap-8 text-sm p-10 rounded-lg border-1',
        className,
        {
          'border-redN300': severity === 'error',
          'bg-redN25': severity === 'error',
        }
      )}
    >
      <Icon
        className="flex-shrink-0"
        name="Alert"
        size="sm"
        color={getColor()}
      />
      <span>{children}</span>
    </div>
  );
};

export default Alert;
