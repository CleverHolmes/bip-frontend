import classnames from 'classnames';
import { useTranslation } from 'next-i18next';
import React, { useContext } from 'react';

import Icon from 'components/new/Icon';
import Tab from 'components/new/Tab';
import { ScreenSize, useMediaQuery } from 'hooks/useScreenSize';
import { StepperContext } from 'pages/onboarding';
import { SlideButton } from './SlideButton';
import type { IconNames } from 'components/new/Icon/icons';

export type StepperItemProperties = {
  title: string;
  subTitle?: { text: string; className?: string };
  iconName: IconNames;
  disabled?: boolean;
};

type StepperProperties = {
  items: StepperItemProperties[];
  panels: React.ReactNode;
};

const Stepper: React.FC<StepperProperties> = ({ items, panels }) => {
  const { t } = useTranslation();
  const isLgUp = useMediaQuery(ScreenSize.lg, 'gt');
  const { activeStepNumber, setActiveStepNumber } = useContext(StepperContext);

  const nextTab = () => {
    if (activeStepNumber < items.length - 1) {
      setActiveStepNumber(activeStepNumber + 1);
    }
  };

  const previousTab = () => {
    if (activeStepNumber > 0) {
      setActiveStepNumber(activeStepNumber - 1);
    }
  };

  const inNextDisabled =
    activeStepNumber === items.length - 1 ||
    Boolean(items[activeStepNumber + 1]?.disabled);

  const inPreviousDisabled = activeStepNumber === 0;

  return (
    <Tab.Group selectedIndex={activeStepNumber} onChange={setActiveStepNumber}>
      <Tab.List className="flex relative flex-row justify-center w-full mt-4 md:mt-0">
        {items.map(({ title, iconName, subTitle, disabled }, i) => (
          <Tab
            // hide the tab if it's not the selected one only in mobile
            className={classnames('font-headings', {
              'hidden md:block': i !== activeStepNumber,
            })}
            key={title}
            icon={
              <Icon
                size={isLgUp ? 'lg' : 'md'}
                name={iconName}
                color="currentColor"
              />
            }
            subTitle={subTitle?.text}
            subTitleClassName={classnames(subTitle?.className, 'text-base')}
            disabled={disabled}
            currentIndex={i}
            totalTabs={items.length}
          >
            {t(title)}
          </Tab>
        ))}
        <SlideButton onClick={previousTab} disabled={inPreviousDisabled}>
          <Icon name="Left" size="sm" color="currentColor" />
        </SlideButton>

        <SlideButton
          onClick={nextTab}
          disabled={inNextDisabled}
          className="right-0"
        >
          <Icon name="Right" size="sm" color="currentColor" />
        </SlideButton>
      </Tab.List>

      <Tab.Panels className="w-full">{panels}</Tab.Panels>
    </Tab.Group>
  );
};

export default Stepper;
