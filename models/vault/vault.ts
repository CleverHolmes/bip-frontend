export type VaultFile = {
  uuid: string;
  filename_original: string;
  created_at: string;
  folder: string;
  uri: string;
};

export type VaultFolder = {
  user_uuid: string;
  folders: string[];
};

export type FolderName = {
  user_uuid: string;
  folder: string;
  folder_new_name: string;
};

export type VaultRequest = {
  params: {
    user_uuid: string;
    folder?: string;
  };
};

export type DeleteFolderRequest = {
  data: {
    user_uuid: string;
    folder: string;
  };
};

export type RenameFolderRequest = {
  user_uuid: string;
  folder: string;
  folder_new_name: string;
};

export type RenameFolderResponse = {
  folder_new_name: string;
};
