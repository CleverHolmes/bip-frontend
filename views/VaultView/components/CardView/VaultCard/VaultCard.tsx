import React, { useState } from "react";
import Image from "next/image";
import classNames from "classnames";

import Card from "components/new/Card";
import Checkbox from "components/new/Checkbox/Checkbox";
import IconButton from "components/new/IconButton";
import Menu from "components/new/Menu";

import DropdownMenu from "../DropdownMenu/DropdownMenu";
import { cardDropDownItems } from "views/VaultView/data/DropDown";

type VaultCardProperties = {
  description: string;
  className?: string;
  type?: string;
};

const VaultCard: React.FC<VaultCardProperties> = ({
  className,
  description,
  type,
}) => {
  const [openToggle, setOpenToggle] = useState(false);
  return (
    <Card
      className={classNames(
        "flex flex-col items-center justify-center mx-auto py-0 pt-5 px-0 w-[14.25rem] h-[17.625rem]",
        className
      )}
    >
      <div className="w-full h-full px-5 border-b-1 border-grayN50">
        <div className=" flex h-full flex-col align-middle gap-1 isolate">
          {/* Actions */}
          <div className="flex row justify-between items-center">
            <Checkbox label="" className=""></Checkbox>

            {/* <IconButton className="cursor-pointer" size="sm" iconName="Menu" /> */}

            <Menu
              button={
                <IconButton
                  className="cursor-pointer"
                  size="sm"
                  iconName="Menu"
                  onClick={() => setOpenToggle(!openToggle)}
                />
              }
              isExpanded={openToggle}
            >
              <div className="flex flex-col">
                <Card isFull className="p-12">
                  {cardDropDownItems.map((cardDropDownItems, index) => {
                    return (
                      <DropdownMenu
                        optionName={cardDropDownItems.optionName}
                        value={cardDropDownItems.value}
                        key={index}
                      />
                    );
                  })}
                </Card>
              </div>
            </Menu>
          </div>

          {/* <Icon  */}
          <div className="h-full items-center justify-center m-auto flex flex-row grow ">
            <Image
              src={`/images/Vault/${type}.svg`}
              width={71}
              height={88}
              // objectFit="contain"
              alt="Card Slider 1"
            />
          </div>
        </div>
      </div>
      {/* description */}
      <div className="w-full flex p-5 row items-center items start">
        {description}
      </div>
    </Card>
  );
};

export default VaultCard;
