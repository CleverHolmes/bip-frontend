import React, { useEffect, useRef, useState } from 'react';
import resolveConfig from 'tailwindcss/resolveConfig';
import classNames from 'classnames';

import Icon from 'components/new/Icon';
import tailwindConfig from 'tailwind.config';

const fullConfig = resolveConfig(tailwindConfig);

type AccordionProperties = {
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  label: string;
  defaultOpen?: boolean;
};

const Accordion: React.FC<AccordionProperties> = ({
  children,
  className,
  size = 'lg',
  label,
  defaultOpen = false,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const contentSpace = useRef<any>(null);

  useEffect(() => {
    if (contentSpace) {
      if (defaultOpen) {
        setIsOpen(true);
      }
    }
  }, [contentSpace]);

  useEffect(() => {
    if (defaultOpen) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [defaultOpen]);

  const commonClasses = 'flex flex-col w-max ' + className;
  const iconColor = isOpen
    ? fullConfig.theme.colors.grayN300
    : fullConfig.theme.colors.grayN100;
  const textColor = isOpen ? ' text-grayN300 ' : ' text-grayN100 ';
  const iconName = isOpen ? 'Up' : 'Down';
  const fontSize =
    size === 'sm'
      ? ' text-sm font-semibold '
      : size === 'md'
      ? ' text-base font-semibold '
      : ' text-lg font-bold ';
  const styleLg = size === 'lg' ? ' border-grayN50 border-y py-24 px-16 ' : '';

  const toggleAccordion = () => {
    setIsOpen((prevState) => !prevState);
  };

  return (
    <div className={commonClasses}>
      <div
        className={'flex flex-row justify-between cursor-pointer' + styleLg}
        onClick={toggleAccordion}
      >
        <span className={'font-headings mr-24' + fontSize + textColor}>
          {label}
        </span>
        <Icon
          className="ml-4"
          name={iconName}
          size={size === 'lg' ? 'md' : 'sm'}
          color={iconColor}
        />
      </div>
      <div
        className={classNames('flex-row overflow-hidden hidden py-24', {
          '!flex': isOpen,
        })}
        ref={contentSpace}
      >
        {children}
      </div>
    </div>
  );
};

export default Accordion;
