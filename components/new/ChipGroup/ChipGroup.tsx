import { useTranslation } from 'next-i18next';

import Chip from 'components/new/Chip';
import ChipCounter from 'components/new/ChipCounter/ChipCounter';

type ChipValue = {
  label: string;
  value?: string;
  count?: number;
};

type ChipGroupProps = {
  onClick: (str: string) => void;
  selectedLabel: string;
  labels: ChipValue[];
  className?: string;
};

const ChipGroup = ({
  onClick,
  selectedLabel,
  labels,
  className,
}: ChipGroupProps) => {
  const { t } = useTranslation();
  return (
    <span className={`${className || ''} relative z-0 inline-flex gap-4`}>
      {labels?.map((item, index) => (
        <Chip
          key={index}
          annexable={false}
          variant="light"
          selected={selectedLabel === (item.value || item.label)}
          label={item.label}
          onClick={() => onClick(item.value || item.label)}
        >
          <ChipCounter
            selected={selectedLabel === (item.value || item.label)}
            count={item.count}
          />
        </Chip>
      ))}
    </span>
  );
};

export default ChipGroup;
