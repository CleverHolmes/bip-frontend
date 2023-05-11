import React, { useRef, useState } from 'react';

import Icon from 'components/Icon';

interface AccordionProps {
  title: string;
  maxHeight?: string;
  children?: React.ReactNode;
  smaller?: true;
}

export const Accordion = ({
  title,
  maxHeight,
  children,
  smaller,
}: AccordionProps) => {
  const [active, setActive] = useState<boolean>(true);
  const [height, setHeight] = useState(maxHeight);
  const [rotate, setRotate] = useState<string>(
    `transform duration-700 ease ${smaller ? 'mt-2' : ''}`
  );

  const contentSpace = useRef(null);

  function toggleAccordion() {
    setActive((prevState) => !prevState);
    // @ts-ignore
    setHeight(
      active
        ? '0px'
        : maxHeight ||
            (contentSpace.current &&
              `${(contentSpace.current as any).scrollHeight}px`) ||
            ''
    );
    setRotate(
      active
        ? `transform duration-700 ease rotate-180 ${smaller ? 'mb-2' : ''}`
        : `transform duration-700 ease ${smaller ? 'mt-2' : ''}`
    );
  }

  return (
    <div className="flex flex-col w-full">
      <button
        className={`box-border flex items-center appearance-none cursor-pointer focus:outline-none
          ${smaller ? 'py-4' : 'py-6 justify-between'}`}
        onClick={toggleAccordion}
      >
        <p
          className={`inline-block font-bold font-custom1 font-primary text-xl ' +
            ${smaller ? 'text-left md:text-xl' : 'md:text-2xl'}`}
        >
          {title}
        </p>
        <Icon
          name="ChevronDown"
          className={`${rotate} inline-block fill-inputGray cursor-pointer ${
            smaller ? 'ml-2' : ''
          }`}
          viewBox="0 0 18 18"
          size="16"
        />
      </button>
      <div
        ref={contentSpace}
        style={{ maxHeight: `${height}` }}
        className="overflow-auto duration-700 ease-in-out transition-max-height"
      >
        <div className={`${smaller ? '' : 'mb-5 sm:mt-2'}`}>
          <div
            className={`${
              smaller
                ? 'pt-2 overflow-hidden'
                : 'bg-white border-2 rounded-lg drop-shadow-md border-borderColor'
            }`}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Accordion;
