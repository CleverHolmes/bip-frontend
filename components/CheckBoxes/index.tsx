import React from 'react';

import HeaderSplitPrimaryButton from 'components/HeaderSplitPrimaryButton';

type Props = {
  onChange: (str: any) => void;
  checkList: string[];
  label?: string;
  selections: string[];
  smaller?: boolean;
};

const CheckBoxes: React.FC<Props> = ({
  onChange,
  checkList,
  label,
  selections,
  smaller,
}) => {
  return (
    <div className="flex flex-col">
      <label className="block mb-16 text-lg font-bold font-custom1 md:text-xl lg:text-2xl">
        {!!label && <HeaderSplitPrimaryButton label={label} />}
      </label>
      {checkList.map((item) => {
        return ((selections.includes('licensor') ||
          selections.includes('licensee')) &&
          item === 'agency') ||
          (selections.includes('agency') && item !== 'agency') ? (
          <label
            className="flex items-center justify-start mb-12 text-xl md:text-5xl lg:text-7xl"
            key={item}
          >
            <div className="ml-6 text-lg cursor-pointer lg:ml-10 sm:text-3xl lg:text-5xl">
              <span className="px-4 font-bold sm:px-10 font-custom1 text-inputGray">
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </span>
            </div>
          </label>
        ) : (
          <label
            className={
              'flex items-center justify-start mb-12 ' +
              (smaller
                ? 'text-lg md:text-xl lg:text-2xl'
                : 'text-xl sm:text-5xl lg:text-7xl')
            }
            key={item}
          >
            <input
              type="checkbox"
              value={item}
              checked={selections.includes(item)}
              onChange={() => onChange(item)}
              className={
                'cursor-pointer hover:bg-inputGray' +
                (smaller
                  ? ' text-sm md:text-base lg:text-lg'
                  : ' text-lg sm:text-xl lg:text-2xl')
              }
            />
            <span
              className={
                'px-4 font-bold sm:px-10 font-custom1 text-primary' +
                (smaller ? ' text-xl sm:text-3xl lg:text-4xl' : ' ')
              }
            >
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </span>
          </label>
        );
      })}
    </div>
  );
};

export default CheckBoxes;
