import { useState } from 'react';
import resolveConfig from 'tailwindcss/resolveConfig';

import Icon from 'components/new/Icon/Icon';
import tailwindConfig from 'tailwind.config';

const fullConfig = resolveConfig(tailwindConfig);

type SortButtonProps = {
  onClick: () => void;
  label?: string;
  isActive: boolean;
};
const SortButton = ({ onClick, label, isActive }: SortButtonProps) => {
  const [clicked, setClicked] = useState(false);
  return (
    <div
      className="flex flex-row items-center gap-8 cursor-pointer"
      onClick={() => {
        setClicked((prev) => !prev);
        onClick();
      }}
    >
      {label}
      <Icon
        className={`${clicked ? '-rotate-90' : 'rotate-90'} transition-all`}
        size="sm"
        color={
          isActive
            ? fullConfig.theme.colors.grayN500
            : fullConfig.theme.colors.grayN75
        }
        name="RightArrow"
      />
    </div>
  );
};
export default SortButton;
