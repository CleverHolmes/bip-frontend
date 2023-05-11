import React from 'react';
import { useQuery } from '@tanstack/react-query';

import {
  requestURIInvoiceHistoryCall,
  requestURIInvoiceHistoryQueryKey,
} from 'api/tipalti/requestURIInvoiceHistoryCall';
import useStore from 'modules/Store';

const InvoiceHistory: React.FC = () => {
  const userUuid = useStore((state) => state.userUUID);

  const { data } = useQuery({
    queryKey: [requestURIInvoiceHistoryQueryKey],
    queryFn: async () => {
      return await requestURIInvoiceHistoryCall({ userUuid });
    },
    enabled: !!userUuid,
  });

  return (
    <>
      <iframe src={data?.uri} className="w-full h-screen" />
    </>
  );
};

export default InvoiceHistory;
