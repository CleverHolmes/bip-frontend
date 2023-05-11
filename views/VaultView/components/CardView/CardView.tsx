import React, { useEffect, useState } from "react";

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
import SearchBar from "components/new/SearchBar";
import { useFileContext } from "../context/fileContext";
import Icon from "components/new/Icon";
import InputField from "components/new/InputField";
import Checkbox from "components/new/Checkbox";
import Radio from "components/new/Radio";

const data = [
  { description: "Investment Contract.Pdf", type: "PDF" },
  { description: "Progress Report.Xls", type: "XLS" },
  { description: "Investment Numbers.Doc", type: "DOC" },
  { description: "Progress Report.Pdf", type: "PDF" },
  { description: "Agency Operating Agreemen...", type: "PNG" },
  { description: "Deal Sizing 2023.Xls", type: "XLS" },
  { description: "Growth Projections.Pdf", type: "PDF" },
  { description: "Company Queterly Report.Pdf", type: "PDF" },
];

const CardView: React.FC<any> = (props) => {
  const { t } = useTranslation();

  const [subPanelToggle, setSubPanelToggle] = useState(false);
  const [newOpenToggle, setNewOpenToggle] = useState(false);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [renameModalOpen, setRenameModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [menuValue, setMenuValue] = useState("");
  const [openSearch, setOpenSearch] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { fileList } = useFileContext();

  useEffect(() => {
    if (menuValue === "Rename Folder") {
      setRenameModalOpen(true);
    } else if (menuValue === "Delete Folder") {
      setDeleteModalOpen(true);
    } else if (menuValue === "Create Folder") {
      setCreateModalOpen(true);
    }
  }, [menuValue]);

  function closeModal() {
    if (renameModalOpen) {
      setRenameModalOpen(false);
    } else if (deleteModalOpen) {
      setDeleteModalOpen(false);
    } else if (filterModalOpen) {
      setFilterModalOpen(false);
    } else if (createModalOpen) {
      setCreateModalOpen(false);
    }
  }

  function openModal() {
    setFilterModalOpen(true);
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
                  onClick={() => setNewOpenToggle(!newOpenToggle)}
                />
              }
              isExpanded={newOpenToggle}
            >
              <div className="flex flex-col">
                <Card isFull className="p-4">
                  {subDropDownItems.map((subDropDownItems, index) => {
                    return (
                      <DropdownMenu
                        optionName={subDropDownItems.optionName}
                        value={subDropDownItems.value}
                        key={index}
                        setValue={setMenuValue}
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
                iconAfter={subPanelToggle ? "Up" : "Down"}
                variant="secondary"
                size="lg"
                onClick={() => setSubPanelToggle(!subPanelToggle)}
              >
                New
              </Button>
            }
            isExpanded={subPanelToggle}
          >
            <div className="flex flex-col">
              <Card isFull className="p-4">
                {newDropDownItems.map((newDropDownItems, index) => {
                  return (
                    <DropdownMenu
                      optionName={newDropDownItems.optionName}
                      value={newDropDownItems.value}
                      key={index}
                      setValue={setMenuValue}
                    />
                  );
                })}
              </Card>
            </div>
          </Menu>
        </div>
      </div>
      {/* Filter Bar */}
      <div className="flex items-center mb-32">
        <Button
          iconBefore="Filter"
          variant="secondary"
          onClick={() => {
            openModal();
          }}
        >
          {t("vault.filter-files")}
        </Button>
        <SearchBar
          openSearch={openSearch}
          setOpenSearch={setOpenSearch}
          setSearchQuery={setSearchQuery}
          searchQuery={searchQuery}
        />
        {fileList.length > 0 && (
          <>
            <h1 className="ml-68">{fileList.length}selected</h1>
            <div className="cursor-pointer ml-36">
              <Icon name="Download" size="md" />
            </div>
            <div className="cursor-pointer ml-5">
              <Icon name="Trash" size="md" />
            </div>
          </>
        )}
      </div>
      {/* Breadcrumbs  */}
      <div className="grid grid-cols-4 gap-2 flex-wrap">
        <Subfolder title="Subfolder 1" />
        <Subfolder title="Subfolder 2" />
        <Subfolder title="Subfolder 3" />
      </div>
      {/* Main Card View */}
      <div className="grid grid-cols-4 gap-12 mt-16">
        {data.map((item, index) => (
          <VaultCard
            description={item.description}
            type={item.type}
            key={index}
          />
        ))}
      </div>
      <DialogModal
        closeModal={closeModal}
        isOpen={renameModalOpen}
        dialogTitle={t("vault.rename-folder")}
      >
        <div className="p-20 border-b-2 border-[#E9E9E9] w-[600px]">
          <InputField
            label={t("vault.folder-name")}
            className="text-grayN75 w-full text-base"
            fullWidth
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
      <DialogModal
        closeModal={closeModal}
        isOpen={deleteModalOpen}
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
      </DialogModal>
      <DialogModal
        closeModal={closeModal}
        isOpen={filterModalOpen}
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
      </DialogModal>
      <DialogModal
        closeModal={closeModal}
        isOpen={createModalOpen}
        dialogTitle={t("vault.create-folder")}
      >
        <div className="p-20 border-b-2 border-[#E9E9E9] w-[600px]">
          <InputField
            label={t("vault.type-folder-name")}
            className="text-grayN75 w-full text-base"
            fullWidth
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
      </DialogModal>
    </div>
  );
};
export default CardView;
