import { FileBase64Item } from 'models/common/fileBase64Item';

export type CreateNonInteractiveUserRequest = {
  companyName: string;
  role: string;
  about?: string;
  representationDocuments: FileBase64Item[];
};

export type CreateNonInteractiveUserResponse = {
  email: string;
  companyName: string;
  uuid: string;
};
