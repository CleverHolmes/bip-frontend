export type ImageRequest = {
  data: {
    item_uuid: string;
    uri: string;
  };
};

export type ImageRequestCover = {
  item_uuid: string;
  uri: string;
};

export type PostImageBase64Request = {
  item_uuid: string;
  filename_original: string;
  fileContentsBase64String: string;
};
