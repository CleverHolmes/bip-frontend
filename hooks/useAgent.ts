import { useLayoutEffect, useState } from 'react';

import useStore from '../modules/Store';
import useTokensOrCookies from 'contexts/TokensOrCookies';
import { UserRoles } from 'models/user/user';

const useAgent = () => {
  const roles = useStore((state) => state.roles);
  const userUUID = useStore((state) => state.userUUID);
  const [isActingAsAgent, setIsActingAsAgent] = useState<boolean>(false);
  const { companyRepresented } = useTokensOrCookies();

  useLayoutEffect(() => {
    if (!companyRepresented && roles.includes(UserRoles.AGENCY)) {
      setIsActingAsAgent(true);
    } else if (
      roles.includes(UserRoles.AGENCY) &&
      companyRepresented === userUUID
    ) {
      setIsActingAsAgent(true);
    } else {
      setIsActingAsAgent(false);
    }
  }, [companyRepresented, userUUID, roles]);

  // are they an agent or acting on behalf of someone
  return isActingAsAgent;
};

export default useAgent;
