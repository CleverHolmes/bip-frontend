import React from 'react';
import { useTranslation } from 'next-i18next';

import PaymentSetup from './components/PaymentSetup';

const PaymentInformationView: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div>
      <div className="text-xl font-bold font-custom1 lg:text-3xl text-primary">
        {t('settings.payment-setup.title')}
      </div>
      <div className="mt-6">
        <PaymentSetup />
      </div>
    </div>
  );
};

export default PaymentInformationView;
