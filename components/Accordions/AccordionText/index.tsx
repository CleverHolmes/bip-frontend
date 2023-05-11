import React, { useState } from 'react';

import Icon from 'components/Icon';

interface AccordionProps {
  textTop: string;
  textTopShortForm: string;
  textBottom: string;
  lock?: boolean;
}

export const AccordionText = ({
  textTop,
  textTopShortForm,
  textBottom,
  lock,
}: AccordionProps) => {
  const [active, setActive] = useState<boolean>(true);
  const [rotate, setRotate] = useState<string>('transform duration-700 ease');

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
        className="box-border flex items-center justify-between appearance-none cursor-pointer focus:outline-none"
        onClick={() => {
          textTop.length > 40 && toggleAccordion();
        }}
      >
        {active ? (
          <div className="flex flex-col">
            <div className="flex items-center text-base font-normal text-left font-custom2 text-inputGray">
              {textBottom}
              {lock && (
                <Icon
                  name="Lock"
                  className="mt-1 ml-1 fill-button"
                  viewBox="0 0 18 18"
                  size="14"
                />
              )}
            </div>
            <div className="mt-1 text-lg font-normal text-left whitespace-pre-wrap font-custom2 text-primary">
              {textTop.length > 40 ? textTopShortForm : textTop}
            </div>
          </div>
        ) : (
          <div className="flex flex-col">
            <div className="flex items-center text-base font-normal text-left font-custom2 text-inputGray">
              {textBottom}
              {lock && (
                <Icon
                  name="Lock"
                  className="mt-1 ml-1 fill-button"
                  viewBox="0 0 18 18"
                  size="14"
                />
              )}
            </div>
            <div className="text-lg font-normal text-left whitespace-pre-wrap font-custom2 text-primary">
              {textTop}
            </div>
          </div>
        )}
        {textTop.length > 40 && (
          <div className="w-6 h-6">
            <Icon
              name="ChevronDown"
              className={`${rotate} inline-block fill-inputGray cursor-pointer`}
              viewBox="0 0 18 18"
              size="16"
            />
          </div>
        )}
      </button>
    </div>
  );
};

export default AccordionText;
