import { SVGProps } from 'react';
import resolveConfig from 'tailwindcss/resolveConfig';

import tailwindConfig from 'tailwind.config';
import { IconNames, Icons } from './icons';

const fullConfig = resolveConfig(tailwindConfig);

type IconProperties = {
  className?: string;
  color?: string;
  size?: '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  name: IconNames;
  onClick?: () => void;
} & SVGProps<SVGSVGElement>;

const Icon: React.FC<IconProperties> = ({
  className,
  size = 'md',
  name,
  color = fullConfig.theme.colors.grayN500,
  ...props
}) => {
  const getSize = () => {
    switch (size) {
      case '2xs':
        return fullConfig.theme.spacing[10];
      case 'xs':
        return fullConfig.theme.spacing[12];
      case 'sm':
        return '1rem';
      case 'md':
        return fullConfig.theme.spacing[24];
      case 'lg':
        return fullConfig.theme.spacing[32];
      case 'xl':
        return fullConfig.theme.spacing[40];
      default:
        break;
    }
  };

  return (
    <svg
      className={className}
      width={getSize()}
      height={getSize()}
      viewBox="0 0 24 24"
      fill="none"
      {...props}
    >
      {Icons[name](color)}
    </svg>
  );
};

export default Icon;
