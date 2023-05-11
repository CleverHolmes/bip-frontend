import React, { useRef, useState } from 'react';
import { useTranslation } from 'next-i18next';

import Icon from 'components/Icon';

interface AccordionProps {
  children?: React.ReactNode;
}

export const Accordion = ({ children }: AccordionProps) => {
  const { t } = useTranslation();
  const [active, setActive] = useState<boolean>(true);
  const [rotate, setRotate] = useState<string>('transform duration-700 ease');

  const contentSpace = useRef(null);

  function toggleAccordion() {
    setActive((prevState) => !prevState);
    setRotate(
      active
        ? 'transform duration-700 ease rotate-180'
        : 'transform duration-700 ease'
    );
  }

  return (
    <div className="flex flex-col w-full">
      <button
        className="box-border flex items-center justify-between pt-6 appearance-none cursor-pointer focus:outline-none"
        onClick={toggleAccordion}
      >
        <p className="flex flex-row items-center justify-center text-lg font-bold text-white transition duration-150 ease-in-out cursor-pointer font-custom1">
          {t('home.brand-categories')}
          <Icon
            name="ChevronDown"
            className={`${rotate} fill-white cursor-pointer ml-2 ${
              active ? 'mt-2' : 'mb-2'
            }`}
            viewBox="0 0 18 18"
            size="18"
          />
        </p>
      </button>
      <div
        ref={contentSpace}
        className="overflow-auto text-left duration-700 ease-in-out"
      >
        {active && (
          <div className="text-lg text-white lg:text-xl">{children}</div>
        )}
      </div>
    </div>
  );
};

export default Accordion;
