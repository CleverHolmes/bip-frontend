import React from 'react';
import { useTranslation } from 'next-i18next';

import SelectButton from 'components/Buttons/SelectButton';
import HeaderSplitPrimaryButton from 'components/HeaderSplitPrimaryButton';

type Props = {
  checkList: any[];
  types?: string[];
  label?: string;
  bubbleName: string;
  defaultValue?: string[];
  state: any;
  setState: any;
  children?: React.ReactNode;
  smaller?: boolean;
  selectAll?: boolean;
  extraText?: string;
};

const BubbleList: React.FC<Props> = ({
  label,
  checkList,
  types,
  state,
  setState,
  smaller,
  selectAll,
  extraText,
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
  const { t } = useTranslation();
  const isAllSelected = checkList.length === state.selections.length;

  const selectGlobal = () => {
    let sel = state.selections;
    checkList.map((selectionItem) => {
      if (!sel.includes(selectionItem.value)) {
        sel.push(selectionItem.value);
      }
    });
    setState({
      selections: sel,
    });
  };

  const selectNone = () => {
    let sel = state.selections;
    checkList.map((selectionItem) => {
      sel = sel.filter((e: string) => e !== selectionItem.value);
    });
    setState({
      selections: sel,
    });
  };

  const selectAllTypes = (type: string) => {
    let sel = state.selections;
    checkList.map((selectionItem) => {
      if (selectionItem.type === type && !sel.includes(selectionItem.value)) {
        sel.push(selectionItem.value);
      }
    });
    setState({
      selections: sel,
    });
  };

  const selectNoneTypes = (type: string) => {
    let sel = state.selections;
    checkList.map((selectionItem) => {
      if (selectionItem.type === type) {
        sel = sel.filter((e: string) => e !== selectionItem.value);
      }
    });
    setState({
      selections: sel,
    });
  };

  const smallerClass = smaller
    ? 'mb-4 lg:mb-6 text-lg md:text-xl lg:text-2xl'
    : 'mb-12 text-xl md:text-5xl lg:text-7xl';
  const smallerTypes = smaller
    ? 'mt-6 mb-2 text-lg lg:mb-4 xl:mb-6  md:text-xl lg:text-2xl'
    : 'mb-8 text-lg lg:mb-12 xl:mb-16  md:text-xl lg:text-2xl';
  const smallerMargin = smaller ? 'mb-8 ' : 'mb-16 ';

  return (
    <div className="flex flex-col">
      <label
        className={
          smallerMargin +
          ' text-lg font-bold font-custom1 md:text-xl lg:text-2xl flex items-center'
        }
      >
        {!!label && <HeaderSplitPrimaryButton label={label} />}
        <span className="ml-2 text-base font-normal text-inputGray lg:text-lg">
          {extraText && `(${extraText})`}
        </span>
        {selectAll && !types && (
          <div
            className={
              'font-normal ml-2 underline rounded-full flex justify-center items-center text-base text-inputGray hover:text-button cursor-pointer mt-1 '
            }
            onClick={() => {
              isAllSelected ? selectNone() : selectGlobal();
            }}
          >
            {isAllSelected ? t('select_none') : t('select_all')}
          </div>
        )}
      </label>
      {!!types && (
        <div className={smallerClass}>
          <SelectButton
            checked={isAllSelected}
            onClick={() => {
              isAllSelected ? selectNone() : selectGlobal();
            }}
            item="Global"
            smaller={smaller}
          />
        </div>
      )}
      <div className="flex flex-col">
        {types ? (
          types.map((type: string) => {
            const isAllTypesSelected =
              checkList.filter(
                (obj) =>
                  obj.type === type && state.selections.includes(obj.value)
              ).length === checkList.filter((obj) => obj.type === type).length;
            return (
              <div key={type} className="flex flex-col">
                <div className={'flex items-center ' + smallerTypes}>
                  <div
                    key={type}
                    className={'font-bold font-custom1 text-primary'}
                  >
                    {type}
                  </div>
                  {selectAll && (
                    <div
                      className={
                        'font-normal ml-2 underline rounded-full flex justify-center items-center text-base text-inputGray hover:text-button cursor-pointer mt-1 '
                      }
                      onClick={() =>
                        isAllTypesSelected
                          ? selectNoneTypes(type)
                          : selectAllTypes(type)
                      }
                    >
                      {isAllTypesSelected ? t('select_none') : t('select_all')}
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap">
                  {checkList.map((item: any) => {
                    return (
                      <div key={item.value}>
                        {item.type === type && (
                          <div className={smallerClass}>
                            <SelectButton
                              checked={
                                state.selections.filter(
                                  (e: string) => e === item.value
                                ).length === 1
                              }
                              onClick={toggleEvent}
                              item={item.value}
                              smaller={smaller}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-wrap">
            {checkList.map((item: any) => {
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
        )}
      </div>
    </div>
  );
};

export default BubbleList;
