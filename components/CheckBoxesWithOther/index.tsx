import React from 'react';

import HeaderSplitPrimaryButton from 'components/HeaderSplitPrimaryButton';

type Props = {
  onChange: (str: number) => void;
  checkList: number[];
  label?: string;
  selections: number[];
};

const CheckBoxes: React.FC<Props> = ({
  onChange,
  checkList,
  label,
  selections,
}) => {
  return (
    <div className="flex flex-col">
      <label className="block mb-16 text-lg font-bold font-custom1 md:text-xl lg:text-2xl">
        {!!label && <HeaderSplitPrimaryButton label={label} />}
      </label>
      {checkList.map((item) => {
        return (
          <label
            className="flex items-center justify-start mb-12 text-xl md:text-5xl lg:text-7xl"
            key={item}
          >
            <input
              type="checkbox"
              value={item}
              checked={selections.includes(item)}
              onChange={() => onChange(item)}
              className="text-lg cursor-pointer md:text-xl lg:text-2xl"
            />
            <span className="px-4 font-bold sm:px-10 font-custom1 text-primary">
              {item}
            </span>
          </label>
        );
      })}
    </div>
  );
};

export default CheckBoxes;
