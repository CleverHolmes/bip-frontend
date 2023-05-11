/* eslint-disable import/order */
/* eslint-disable prettier/prettier */
import { useState } from "react";
// import TreeView from "./components/SidePanel/TreeView";
import Button from "components/new/Button/Button";
import { useTranslation } from "next-i18next";
// import Image from "next/image";
// import Icon from "components/new/Icon";

import { Treeview } from "./components/TreeView/TreeView";
import { data } from "./data/TreeData";
import CardView from "./components/CardView/CardView";
import TextHeader from "components/new/TextHeader";
import IconButton from "components/new/IconButton";
import DialogModal from "components/DialogModal";
export default function VaultView() {
  const { t } = useTranslation();
  const [selected, select] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }
  return (
    <>
      {/* SideBar */}
      <div className="grid grid-cols-5 gap-24">
        {/* <div className="w-[17.75rem] shadow-box-standard flex flex-col"> */}
        <div className="col-span-1 shadow-clogo pt-32">
          <div className="px-24">
            {/* Title */}
            <div className="flex justify-between items-center pb-24">
              <TextHeader
                className="left-6 top-32 font-bold font-headings text-3xl"
                text="Vault"
              />
              <div className="rounded-full border-2 border-grayN75 flex items-center justify-center">
                <IconButton className="" size="md" iconName="Setting" />
              </div>
            </div>
            {/* Create Folder Button */}
            <Button
              className="w-full"
              iconBefore="FolderPlus"
              variant="secondary"
              size="lg"
              onClick={() => setIsOpen(!isOpen)}
            >
              {t("vault.create-folder")}
            </Button>
          </div>
          {/* Folder Tree */}
          <Treeview.Root
            value={selected}
            onChange={select}
            className="h-full mt-4"
          >
            {data.map((node) => (
              <Treeview.Node node={node} key={node.id} />
            ))}
          </Treeview.Root>
        </div>
        <div className="col-span-4">
          <CardView />
        </div>
      </div>
      <DialogModal
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
      </DialogModal>
    </>
  );
}
