import React from "react";
import Link from "next/link";

type DropdownProperties = {
  className?: string;
  value: string;
  optionName: string;
};

const DropdownMenu: React.FC<DropdownProperties> = ({
  className,
  value,
  optionName,
}) => {
  return (
    <>
      <button className="flex flex-col p-4" value={value}>
        {optionName}
      </button>
    </>
  );
};

export default DropdownMenu;
