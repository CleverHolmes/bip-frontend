import React from 'react';
import { useQuery } from '@tanstack/react-query';

import {
  requestURIPaymentHistoryCall,
  requestURIPaymentHistoryQueryKey,
} from 'api/tipalti/requestURIPaymentHistoryCall';
import useStore from 'modules/Store';

const PaymentHistory: React.FC = () => {
  const userUuid = useStore((state) => state.userUUID);

  const { data } = useQuery({
    queryKey: [requestURIPaymentHistoryQueryKey],
    queryFn: async () => {
      return await requestURIPaymentHistoryCall({ userUuid });
    },
    enabled: !!userUuid,
  });

  return (
    <>
      <iframe src={data?.uri} className="w-full h-screen" />
    </>
  );
};

export default PaymentHistory;
