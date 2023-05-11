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
  
  const [isSelect, setIsSelect] = useState(false);
  const [openToggle, setOpenToggle] = useState(false);
  
  function selectFile() {
    setIsSelect(!isSelect);
  }
  
  return (
    <Card
      className={classNames(
        "flex flex-col items-center justify-center py-0 pt-5 px-0 border w-full",
        className,
        isSelect ? "border-blueN100" : "border-grayN50"
      )}
    >
      <div className="w-full h-full px-5 border-b-1 border-grayN50">
        <div className=" flex h-full flex-col align-middle gap-1 isolate">
          {/* Actions */}
          <div className="flex row justify-between items-center">
            <div onClick={selectFile}>
              <Checkbox
                value="ab"
                checked={isSelect}
                mute={true}
                className="cursor-pointer"
              />
            </div>

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
                <Card isFull className="p-4">
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
            
            {/* <Icon  */}
          <div className="flex items-center justify-center px-72 py-52">
          </div>
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
