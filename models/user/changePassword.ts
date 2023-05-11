export type PostChangePasswordResponse = {
  uuid: string;
};

export type PostChangePasswordRequest = {
  password_current: string;
  password_new: string;
};
