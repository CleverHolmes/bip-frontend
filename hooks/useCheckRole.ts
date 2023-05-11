import { useLayoutEffect, useState } from 'react';

import useStore from '../modules/Store';
import { UserRoles } from 'models/user/user';
import useTokensOrCookies from 'contexts/TokensOrCookies';

const useCheckRole = () => {
  const roles = useStore.getState().roles;
  const userUUID = useStore((state) => state.userUUID);

  const [isLicensee, setIsLicensee] = useState(false);
  const [isLicensor, setIsLicensor] = useState(false);
  const [isAgency, setIsAgency] = useState(false);
  const [isActingAsAgency, setIsActingAsAgency] = useState(false);
  const { companyRepresented } = useTokensOrCookies();

  useLayoutEffect(() => {
    setIsLicensee(roles.includes(UserRoles.LICENSEE));
    setIsLicensor(roles.includes(UserRoles.LICENSOR));
    setIsAgency(roles.includes(UserRoles.AGENCY));

    if (!companyRepresented && roles.includes(UserRoles.AGENCY)) {
      setIsActingAsAgency(true);
    } else if (
      roles.includes(UserRoles.AGENCY) &&
      companyRepresented === userUUID
    ) {
      setIsActingAsAgency(true);
    }
  }, [roles, companyRepresented]);

  return {
    isLicensee,
    isLicensor,
    isAgency,
    isActingAsAgency,
  };
};

export default useCheckRole;
