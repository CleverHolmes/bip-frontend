import { useLayoutEffect, useState } from 'react';

import useStore from '../modules/Store';
import useTokensOrCookies from 'contexts/TokensOrCookies';

const useCheckNonInteractiveUser = () => {
  const userUUID = useStore((state) => state.userUUID);

  const [isPending, setIsPending] = useState(true);
  const [isNonInteractive, setIsNonInteractive] = useState(false);

  const { companyRepresented } = useTokensOrCookies();

  useLayoutEffect(() => {
    if (companyRepresented && companyRepresented !== userUUID) {
      setIsNonInteractive(true);
    } else {
      setIsNonInteractive(false);
    }
    if (userUUID) setIsPending(false);
  }, [companyRepresented, userUUID]);

  return {
    isNonInteractive,
    isPending,
  };
};

export default useCheckNonInteractiveUser;
