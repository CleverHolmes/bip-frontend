import { useTranslation } from 'next-i18next';

import type { StepperItemProperties } from 'components/new/Stepper/Stepper';

const useUpdateStepper = (
  items: Array<StepperItemProperties>,
  activeStepNumber: number,
  itemSubtitles: { [x: string]: string }
) => {
  const { t } = useTranslation();

  items[activeStepNumber] = {
    ...items[activeStepNumber],
    disabled: false,
  };

  const lastEnabledItem = items.findIndex((item) => item.disabled) - 1;

  // update subtitles
  items.forEach((item, index) => {
    if (index < activeStepNumber) {
      items[index] = {
        ...item,
        subTitle: {
          text: t(itemSubtitles.done),
          className: 'text-accentN300',
        },
      };
    } else if (index === activeStepNumber) {
      items[index] = {
        ...item,
        subTitle: {
          text:
            lastEnabledItem === index
              ? t(itemSubtitles.active)
              : t(itemSubtitles.done),
          className:
            lastEnabledItem === index ? 'text-blueN300' : 'text-accentN300',
        },
      };
    }
  });

  return items;
};

export default useUpdateStepper;
