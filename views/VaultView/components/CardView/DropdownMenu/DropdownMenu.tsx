import React from "react";
import Link from "next/link";

type DropdownProperties = {
  className?: string;
  value: string;
  optionName: string;
};

const DropdownMenu: React.FC<DropdownProperties> = ({ value, optionName }) => {
  return (
    <>
      <option
        className="flex flex-col text-right p-8 text-[0.875rem] text-grayN100 cursor-pointer hover:text-grayN500"
        value={value}
      >
        {optionName}
        {/* <p className="text-right">{optionName}</p> */}
      </option>
    </>
  );
};

export default DropdownMenu;
