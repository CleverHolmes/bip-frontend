type ChipCounterProps = {
  count: number | undefined;
  selected: boolean;
};

const ChipCounter = ({ count, selected }: ChipCounterProps) => {
  const countClasses = `${selected ? 'bg-white text-blueN300' : ''}`;

  return (
    <>
      {!!count && count > 0 && (
        <div
          className={`${countClasses} text-xs ml-4 rounded-full w-28 h-20 flex items-center justify-center`}
        >
          {count > 99 ? '99+' : count}
        </div>
      )}
    </>
  );
};
export default ChipCounter;
