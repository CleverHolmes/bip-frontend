import React from 'react';
import { useQuery } from '@tanstack/react-query';

import {
  requestURISetupProcessCall,
  requestURISetupProcessQueryKey,
} from 'api/tipalti/requestURISetupProcessCall';
import useStore from 'modules/Store';

const PaymentSetup: React.FC = () => {
  const userUuid = useStore((state) => state.userUUID);

  const { data } = useQuery({
    queryKey: [requestURISetupProcessQueryKey],
    queryFn: async () => {
      return await requestURISetupProcessCall({ userUuid });
    },
    enabled: !!userUuid,
  });

  return (
    <>
      <iframe src={data?.uri} className="w-full h-screen" />
    </>
  );
};

export default PaymentSetup;
