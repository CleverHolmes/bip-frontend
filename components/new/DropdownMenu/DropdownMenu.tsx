import React from "react";

type DropdownProperties = {
  className?: string;
  value: string;
  optionName: string;
  setValue: Function;
};

const DropdownMenu: React.FC<DropdownProperties> = ({
  value,
  optionName,
  setValue,
}) => {
  const handleClick = (name: string) => {
    setValue(name);
  };

  return (
    <option
      className="flex flex-col text-right p-8 text-[0.875rem] text-grayN100 cursor-pointer hover:text-grayN500"
      value={value}
      onClick={() => handleClick(value)}
    >
      {optionName}
    </option>
  );
};

export default DropdownMenu;
