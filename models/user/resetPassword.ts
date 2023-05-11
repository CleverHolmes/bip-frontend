export type ResetPasswordResponse = {
  email: string;
};

export type PasswordPostRequest = {
  email: string;
  password_reset_token: string;
  password: string;
};

export type PasswordPostResponse = {
  email: string;
};
