import useStore from 'modules/Store';
import { UserRoles } from 'models/user/user';

export const checkRole = (role: UserRoles) => {
  const roles = useStore.getState().roles;
  return roles.includes(role);
};
