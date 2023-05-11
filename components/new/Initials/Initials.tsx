import React, { FC } from 'react';

import { generateInitials } from 'utils/generateInitials';

type Props = {
  className?: string;
  name: string;
  size?: number;
};

const Initials: FC<Props> = ({ className, name, size = 2.5 }) => {
  const initials = generateInitials(name);
  return (
    <div
      className={`${
        className || ''
      } relative inline-block w-${size} min-w-${size} h-${size} flex shrink-0 items-center justify-center font-bold text-primary text-sm border-1 bg-backgroundInput rounded-full border-backgroundInput`}
    >
      {initials}
    </div>
  );
};

export default Initials;
