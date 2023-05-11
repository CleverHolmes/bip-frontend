import React from 'react';

import SelectButton from 'components/Buttons/SelectButton';
import HeaderSplitPrimaryButton from 'components/HeaderSplitPrimaryButton';

type Props = {
  checkList: any[];
  label?: string;
  extraText?: string;
  bubbleName: string;
  defaultValue: string[];
  state: any;
  setState: any;
  children?: React.ReactNode;
  smaller?: boolean;
};

const BubbleListNoTypes: React.FC<Props> = ({
  label,
  extraText,
  checkList,
  state,
  setState,
  smaller,
}) => {
  const toggleEvent = (item: string) => {
    let sel = state.selections;
    if (sel.includes(item)) {
      sel = sel.filter((e: string) => e !== item);
    } else {
      sel.push(item);
    }
    setState({
      selections: sel,
    });
  };

  const smallerClass = smaller ? 'mb-4 lg:mb-6' : 'mb-12';
  const smallerMargin = smaller ? 'mb-8 ' : 'mb-16 ';

  return (
    <div className="flex flex-col">
      <label
        className={
          smallerMargin +
          'block text-lg font-bold font-custom1 md:text-xl lg:text-2xl'
        }
      >
        {!!label && <HeaderSplitPrimaryButton label={label} />}
        <span className="ml-2 text-base font-normal text-inputGray lg:text-lg">
          {extraText && `(${extraText})`}
        </span>
      </label>
      <div className="flex flex-wrap">
        {checkList.map((item: any, index: number) => {
          return (
            <div key={item.value}>
              <div className={smallerClass}>
                <SelectButton
                  checked={
                    state.selections.filter((e: string) => e === item.value)
                      .length === 1
                  }
                  onClick={toggleEvent}
                  item={item.value}
                  smaller={smaller}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BubbleListNoTypes;
