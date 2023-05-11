import React from "react";
import Icon from "components/new/Icon";
import Card from "components/new/Card";

type SubfolderProperties = {
  title: string;
  className?: string;
};

const Subfolder: React.FC<SubfolderProperties> = ({ title }) => {
  return (
    <Card isFull>
      <div className="flex justify-between p-16">
        <div className="flex justify-center items-center ">
          <Icon
            name="Folder"
            viewBox="0 0 20 20"
            className="shrink-0 grow-0 mr-2"
          />
          <p className="align-center text-base"> {title}</p>
        </div>
        <div className="flex items-center">
          <Icon name="ChevronRight" size="md" className="shrink-0 grow-0" />
        </div>
      </div>
    </Card>
  );
};
export default Subfolder;
