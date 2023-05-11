import React from 'react';
import { useTranslation } from 'next-i18next';

import Tab from 'components/new/Tab';
import InvoiceHistory from './InvoiceHistory';
import PaymentHistory from './PaymentHistory';

const PaymentCenter: React.FC = () => {
  const { t } = useTranslation();
  const tabs = ['dashboard.invoice-history', 'dashboard.payment-history'];

  return (
    <div className="max-h-[40rem] bg-backgroundInput rounded-lg drop-shadow-lg min-w-full px-4 py-4">
      <div className="p-2 rounded-lg text-inputGray px-3 2xl:px-3.5 my-1 border-2 border-backgroundInput bg-white">
        <Tab.Group>
          <Tab.List className="w-1/3">
            {tabs.map((tab) => (
              <Tab className="text-base" key={tab}>
                {t(tab)}
              </Tab>
            ))}
          </Tab.List>
          <Tab.Panels>
            <Tab.Panel unmount={false}>
              <InvoiceHistory />
            </Tab.Panel>
            <Tab.Panel unmount={false}>
              <PaymentHistory />
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
};

export default PaymentCenter;
