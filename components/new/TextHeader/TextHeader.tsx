import React from 'react';

type ChipProperties = {
  className?: string;
  text: string;
};

const TextHeader: React.FC<ChipProperties> = ({ className, text }) => {
  const commonClasses =
    'flex shrink-0 items-center h-[2.875rem] font-headings ' + className;

  return <h1 className={commonClasses}>{text}</h1>;
};

export default TextHeader;
