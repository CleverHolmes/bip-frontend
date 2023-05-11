import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import React, { useContext, useMemo } from 'react';

import Stepper from 'components/new/Stepper';
import type { StepperItemProperties } from 'components/new/Stepper/Stepper';
import { StepperContext } from 'pages/onboarding';
import Panels from './components/Panels';
import useUpdateStepper from './useUpdateStepper';
import useStore from 'modules/Store';
import { UserRoles } from 'models/user/user';

const stepperSubtitles = {
  active: 'onboarding.in-progress',
  done: 'onboarding.done',
  base: 'onboarding.not-started',
};

const OnboardingView: React.FC = () => {
  const { t } = useTranslation();
  const { activeStepNumber, setActiveStepNumber } = useContext(StepperContext);
  const roles = useStore((state) => state.roles);
  const isLicensee = roles.includes(UserRoles.LICENSEE);
  const isLicensor = roles.includes(UserRoles.LICENSOR);

  const initStepperItems = useMemo<Array<StepperItemProperties>>(
    () => [
      {
        title: 'onboarding.about-you',
        iconName: 'User',
        subTitle: {
          text: t(stepperSubtitles.active),
          className: 'text-blueN300',
        },
      },
      {
        title: 'company-info',
        iconName: 'AllDocs',
        subTitle: { text: t(stepperSubtitles.base) },
        disabled: true,
      },
      {
        title:
          isLicensee || isLicensor
            ? 'onboarding.categories'
            : 'onboarding.your-brands',
        iconName: 'Deal',
        subTitle: { text: t(stepperSubtitles.base) },
        disabled: true,
      },
      {
        title: 'onboarding.confirmation',
        iconName: 'CheckCircle',
        subTitle: { text: t(stepperSubtitles.base) },
        disabled: true,
      },
    ],
    [t, isLicensee, isLicensor]
  );

  const stepperItems = useUpdateStepper(
    initStepperItems,
    activeStepNumber,
    stepperSubtitles
  );

  return (
    <div className="container relative flex items-baseline py-16 px-20 md:pt-10 sm:px-2 md:pr-0 md:pl-6 mx-auto">
      <div className="w-full max-w-7xl mx-auto flex md:flex-row md:items-start flex-col items-center lg:space-x-9">
        <Image
          src="/images/new-logo.svg"
          width={48}
          height={48}
          alt="BIP logo"
          className="cursor-pointer"
        />
        <div className="w-full">
          <Stepper items={stepperItems} panels={<Panels />} />
        </div>
      </div>
    </div>
  );
};

export default OnboardingView;
