import { useState } from "react";
// import TreeView from "./components/SidePanel/TreeView";
import Button from "components/new/Button/Button";
// import { useTranslation } from "next-i18next";
// import Image from "next/image";
// import Icon from "components/new/Icon";

import { Treeview } from "./components/TreeView/TreeView";
import { data } from "./data/TreeData";
import CardView from "./components/CardView/CardView";
import TextHeader from "components/new/TextHeader";
export default function VaultView() {
  // const { t } = useTranslation();
  const [selected, select] = useState<string | null>(null);
  return (
    // <div className="grid grid-cols-4 gap-5">
    //   <div className="col-span-1 pl-5 shadow-xl">
    //     <div className="mt-5 pr-5">
    //     <Button
    //       className="w-full"
    //       iconBefore="FolderPlus"
    //       variant="secondary"
    //     >
    //       {/* {t("company.view-current-products")} */}
    //       Create Folder
    //     </Button>
    //     </div>
    //     <Treeview.Root
    //       value={selected}
    //       onChange={select}
    //       className="h-full mt-4"
    //     >
    //       {data.map((node) => (
    //         <Treeview.Node node={node} key={node.id} />
    //       ))}
    //     </Treeview.Root>
    //     <CardView></CardView>
    //   </div>
    // </div>
    <>
      {/* SideBar */}

      <div className="flex flex-row">
        <div className="w-[17.75rem] shadow-box-standard flex flex-col">
          {/* Title */}
          <TextHeader className="col-[grayN500] w-80 h-40 left-6 top-32 fontfont-bold font-headings  mx-auto" text="Vault" />
          {/* Create Folder Button */}
          <Button
            className="col-span-1 mx-auto"
            iconBefore="FolderPlus"
            variant="secondary"
          >Create Folder</Button>
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
        <div className="w-full">
          <CardView />
        </div>
      </div>
    </>
  );
}
