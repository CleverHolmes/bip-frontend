import { createContext, useContext } from "react";

export type FileStructure = {
  description: string;
  type: string;
};

export type FileContext = {
  fileList: Array<FileStructure>;
  setFileList: (c: Array<FileStructure>) => void;
};

export const GlobalFileContext = createContext<FileContext>({
  fileList: [],
  setFileList: () => {},
});

export const useFileContext = () => useContext(GlobalFileContext);
