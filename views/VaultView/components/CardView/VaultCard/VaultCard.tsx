import React, { useState } from "react";
import Image from "next/image";
import classNames from "classnames";

import Card from "components/new/Card";
import Checkbox from "components/new/Checkbox/Checkbox";
import IconButton from "components/new/IconButton";

import Menu from "components/new/Menu";

import DropdownMenu from "../DropdownMenu/DropdownMenu";
import { cardDropDownItems } from "views/VaultView/data/DropDown";
import { useFileContext } from "../../context/fileContext";

type VaultCardProperties = {
  description: string;
  className?: string;
  type: string;
};

const VaultCard: React.FC<VaultCardProperties> = ({
  className,
  description,
  type,
}) => {
  const [isSelect, setIsSelect] = useState(false);
  const [openToggle, setOpenToggle] = useState(false);
  const { fileList, setFileList } = useFileContext();
  const [menuValue, setMenuValue] = useState("");

  function selectFile() {
    setIsSelect(!isSelect);
    let store = fileList;
    if (!isSelect) {
      store.push({ description: description, type: type });
      setFileList(store);
    } else {
      store = store.filter((item) => item.description !== description);
      setFileList(store);
    }
  }

  return (
    <Card
      className={classNames(
        "flex flex-col items-center justify-center border",
        className,
        isSelect ? "border-blueN100" : "border-grayN50"
      )}
    >
      <div className="p-8 border-b-1 border-grayN50">
        {/* Actions */}
        <div className="">
          <div className="flex items-center justify-between">
            <div onClick={selectFile}>
              <Checkbox
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
                        setValue={setMenuValue}
                      />
                    );
                  })}
                </Card>
              </div>
            </Menu>
          </div>

          {/* <Icon  */}
          <div className="flex items-center justify-center px-72 py-52">
            <Image
              src={`/images/Vault/new_${type}.svg`}
              width={71}
              height={88}
              // objectFit="contain"
              alt="Card Slider 1"
            />
          </div>
        </div>
      </div>
      {/* description */}
      <div className="w-full flex px-8 py-12 row items-center items start">
        {description}
      </div>
    </Card>
  );
};

export default VaultCard;
