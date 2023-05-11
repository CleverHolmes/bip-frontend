import { useTranslation } from 'next-i18next';
import React, { useContext } from 'react';

import Accordion from 'components/new/Accordion';
import Button from 'components/new/Button';
import { StepperContext } from 'pages/onboarding';
import TerritoryList from 'components/new/TerritoryList';

const OperatedTerritories = () => {
  const { t } = useTranslation();

  const { activeStepProgress, setActiveStepProgress } =
    useContext(StepperContext);

  return (
    <Accordion
      defaultOpen={activeStepProgress === 1}
      label={t('onboarding.what-territories-do-you-operate-in-2')}
      className="!w-full"
    >
      <div className="flex flex-col justify-center items-start w-full gap-8 md:gap-36">
        <TerritoryList />
        <Button size="sm" className="w-full md:w-auto self-end">
          {t('onboarding.save-and-continue')}
        </Button>
      </div>
    </Accordion>
  );
};

export default OperatedTerritories;
