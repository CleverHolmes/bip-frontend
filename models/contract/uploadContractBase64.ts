export type UploadContractBase64Request = {
  userUuid: string;
  dealUuid: string;
  filenameOriginal: string;
  fileContentsBase64String: string;
};

export type UploadContractBase64Response = {
  uri: string;
  created_at: string;
};
