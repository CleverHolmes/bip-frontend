import { UserRoles } from 'models/user/user';

export type AboutYouData = {
  role?: UserRoles;
  firstName: string;
  lastName: string;
  tcAgreed: boolean;
};
