export type DelegateRequest = {
  delegate_uuid: string;
  user_uuid: string;
};

export type AddItemPermittedRequest = {
  name: string;
  item_type: string;
  user_uuid: string;
};

export type AddItemPermittedResponse = {
  uuid: string;
  errorMessage: string;
};
