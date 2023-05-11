export type AuthententicationResponse = {
  message: string;
  user_uuid: string;
  token: string;
  primary_user_uuid?: string;
};

export type AuthenticationRequest = {
  email: string;
  password: string;
};
