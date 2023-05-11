/* eslint-disable import/order */
/* eslint-disable prettier/prettier */
import React, { useState } from "react";

// Components
import VaultCard from "./VaultCard";
import IconButton from "components/new/IconButton";
import Menu from "components/new/Menu";
import Button from "components/new/Button";
import Card from "components/new/Card";
import DropdownMenu from "./DropdownMenu";
import { useTranslation } from "next-i18next";

// Constant Data
import Subfolder from "./Subfolder";
import {
  subDropDownItems,
  newDropDownItems,
} from "views/VaultView/data/DropDown";
import DialogModal from "components/DialogModal";

const CardView: React.FC<any> = (props) => {
  const { t } = useTranslation();

  const [openToggle, setOpenToggle] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  return (
    <div className="container p-12 items-center">
      {/* Header */}
      <div className="flex gap-2 flex-wrap justify-between mb-40">
        <div className="flex items-center">
          <div className="">Quaryterly Reports</div>
          <div>
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
                  {subDropDownItems.map((subDropDownItems, index) => {
                    return (
                      <DropdownMenu
                        optionName={subDropDownItems.optionName}
                        value={subDropDownItems.value}
                        key={index}
                      />
                    );
                  })}
                </Card>
              </div>
            </Menu>
          </div>
        </div>
        <div>
          <Menu
            button={
              <Button
                className="mb-0"
                iconAfter={openToggle ? "Up" : "Down"}
                variant="secondary"
                size="lg"
                onClick={() => setOpenToggle(!openToggle)}
              >
                New
              </Button>
            }
            isExpanded={openToggle}
          >
            <div className="flex flex-col">
              <Card isFull className="p-12">
                {newDropDownItems.map((newDropDownItems, index) => {
                  return (
                    <DropdownMenu
                      optionName={newDropDownItems.optionName}
                      value={newDropDownItems.value}
                      key={index}
                    />
                  );
                })}
              </Card>
            </div>
          </Menu>
        </div>
      </div>
      {/* Filter Bar */}
      <div className="flex gap-2 flex-wrap justify-start">
        <div className="flex justify-between mb-40">
          <div className="flex mb-32">
            <Button
              className="w-md"
              iconBefore="Filter"
              variant="secondary"
              onClick={() => {
                openModal();
              }}
            >
              {t("vault.filter-files")}
            </Button>
            <IconButton
              className="ml-16 cursor-pointer"
              size="md"
              iconName="Search"
            />
          </div>
        </div>
      </div>
      {/* Breadcrumbs  */}
      <div className="grid grid-cols-4 gap-2 flex-wrap">
        <Subfolder title="Subfolder 1" />
        <Subfolder title="Subfolder 2" />
        <Subfolder title="Subfolder 3" />
      </div>
      {/* Main Card View */}
      <div className="grid grid-cols-4 gap-2 flex-wrap">
        <VaultCard description="Intros" type="PDF" />
        <VaultCard description="Intros" type="PNG" />
        <VaultCard description="Intros" type="PPT" />
        <VaultCard description="Intros" type="JPG" />
        <VaultCard description="Intros" type="DOC" />
      </div>
      <DialogModal
        closeModal={closeModal}
        isOpen={isOpen}
        dialogTitle={t("vault.rename-folder")}
      >
        <div className="p-20 border-b-2 border-[#E9E9E9] w-[600px]">
          <input
            type="text"
            id="input-group-1"
            className="bg-backgroundInput text-grayN75 text-base rounded-lg border block w-full pl-10 2xl:mr-4 p-2.5 shadow-sm border-grayN100 focus:placeholder:opacity-0"
            placeholder={t("vault.type-folder-name")}
            // value={searchTerm}
            // onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex justify-end items-center gap-16 px-20 py-16">
          <Button className="" variant="secondary" size="lg">
            {t("vault.cancel")}
          </Button>
          <Button className="" variant="primary" size="lg">
            {t("vault.save")}
          </Button>
        </div>
      </DialogModal>
      {/* <DialogModal
        closeModal={closeModal}
        isOpen={isOpen}
        dialogTitle={t("vault.delete-folder")}
      >
        <div className="p-20 border-b-2 border-[#E9E9E9] w-[600px]">
          <h1>
            Are you sure you want to delete <b>Quarterly reports?</b> This
            folder and all its documents & subfolders will be removed
          </h1>
        </div>
        <div className="flex justify-end items-center gap-16 px-20 py-16">
          <Button className="" variant="secondary" size="lg">
            {t("vault.cancel")}
          </Button>
          <Button className="" variant="primary" size="lg">
            {t("vault.delete")}
          </Button>
        </div>
      </DialogModal> */}
      {/* <DialogModal
        closeModal={closeModal}
        isOpen={isOpen}
        dialogTitle={t("vault.create-folder")}
      >
        <div className="p-20 border-b-2 border-[#E9E9E9] w-[600px]">
          <input
            type="text"
            id="input-group-1"
            className="bg-backgroundInput text-grayN75 text-base rounded-lg border block w-full pl-10 2xl:mr-4 p-2.5 shadow-sm border-grayN100"
            placeholder={t("vault.type-folder-name")}
            // value={searchTerm}
            // onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex justify-end items-center gap-16 px-20 py-16">
          <Button className="" variant="secondary" size="lg">
            {t("vault.cancel")}
          </Button>
          <Button className="" variant="primary" size="lg">
            {t("vault.create")}
          </Button>
        </div>
      </DialogModal> */}
      {/* <DialogModal
        closeModal={closeModal}
        isOpen={isOpen}
        dialogTitle={t("vault.filter-files")}
      >
        <div className="grid grid-rows-2 py-32 px-20 border-b-2 border-[#E9E9E9]">
          <div className="flex flex-col gap-24">
            <h3 className="text-lg lg:text-xl font-bold">
              {t("vault.file-types")}
            </h3>
            <div className="grid grid-cols-2 gap-20">
              <Checkbox label="All file types" checked={true} value="ab" />
              <Checkbox label="PDF" checked={true} value="ab" />
              <Checkbox label="Word" checked={true} value="ab" />
              <Checkbox label="Exel" checked={true} value="ab" />
            </div>
          </div>
          <div className="flex flex-col gap-24">
            <h3 className="text-lg lg:text-xl font-bold">
              {t("vault.sort-by")}
            </h3>
            <div className="grid grid-cols-2 gap-20">
              <Radio
                className="mb-16"
                label={t("vault.last-updated")}
                selected={true}
              />
              <Radio
                className="mb-16"
                label={t("vault.alphabetical")}
                selected={false}
              />
              <Radio
                className="mb-16"
                label={t("vault.lastest-version-first")}
                selected={false}
              />
              <Radio
                className="mb-16"
                label={t("vault.latest-version-last")}
                selected={false}
              />
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center px-20 py-16">
          <div className="underline text-base cursor-pointer">
            {t("vault.reset-all")}
          </div>
          <Button className="" variant="primary" size="lg">
            {t("vault.apply-filters")}
          </Button>
        </div>
      </DialogModal> */}
    </div>
  );
};
export default CardView;
