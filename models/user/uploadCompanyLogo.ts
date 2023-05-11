export type UploadCompanyLogoRequest = {
  userUuid: string;
  filenameOriginal: string;
  imageBase64String: string;
};

export type UploadCompanyLogoResponse = {
  uri: string;
  created_at: string;
};
