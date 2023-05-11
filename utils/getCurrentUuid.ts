import { Cookies } from 'react-cookie';

import useStore from 'modules/Store';

export const getCurrentUuid = (checkOperatingUser: boolean = false) => {
  const cookies = new Cookies();
  const companyRepresented = window.sessionStorage.getItem(
    'company_represented'
  );
  const userUUID = useStore.getState().userUUID;
  const operatingUserUuid = useStore.getState().uuid_operating_user;

  if (checkOperatingUser && operatingUserUuid) {
    return operatingUserUuid;
  }

  return cookies.get('company_represented') || companyRepresented || userUUID;
};
