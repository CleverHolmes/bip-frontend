export type UploadFileAttachmentBase64Request = {
  userUuid: string;
  messageConversationUuid: string;
  messageUuid?: string;
  filenameOriginal: string;
  fileContentsBase64String: string;
};

export type UploadFileAttachmentBase64Response = {
  uri: string;
  created_at: string;
};
