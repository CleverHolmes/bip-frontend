import { useTranslation } from 'next-i18next';
import React from 'react';

import { UserRoles } from 'models/user/user';
import Accordion from 'components/new/Accordion';
import RoleCard from '../RoleCard';

const YourRole = () => {
  const { t } = useTranslation();

  return (
    <Accordion
      defaultOpen={true}
      label={t('onboarding.what-is-your-role')}
      className="!w-full"
    >
      <div className="flex flex-col md:flex-row md:justify-start justify-center items-center w-full mb-2 gap-16 px-4">
        <RoleCard
          role={UserRoles.AGENCY}
          iconName="Agency"
          label={t('onboarding.represent-agency')}
        />

        <RoleCard
          role={UserRoles.LICENSEE}
          iconName="Copyright"
          label={t('onboarding.brand-licensee')}
        />

        <RoleCard
          role={UserRoles.LICENSOR}
          iconName="Briefcase"
          label={t('onboarding.brand-licensor')}
        />
      </div>
    </Accordion>
  );
};

export default YourRole;
