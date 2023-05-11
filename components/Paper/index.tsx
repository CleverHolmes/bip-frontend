import React, { FC, ReactNode } from 'react';

type Props = {
  children: ReactNode;
  className?: string;
};

const Paper: FC<Props> = ({ children, className }) => {
  return (
    <div
      className={`flex flex-col px-5 py-5 sm:px-10 sm:py-10 rounded-lg shadow-lg hover:shadow-inner hover:shadow-button/50 lg:px-20 lg:py-20 ${className}`}
    >
      {children}
    </div>
  );
};

export default Paper;
