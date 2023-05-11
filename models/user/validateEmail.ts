export type ValidateEmailRequest = {
  email: string;
};

export type ValidateEmailResponse = {
  isAvailable: boolean;
  isValid: boolean;
};
