import React from 'react';
import classNames from 'classnames';

import Icon from 'components/new/Icon';
import type { IconNames } from 'components/new/Icon/icons';
import Card from 'components/new/Card';

type StatsBlockProperties = {
  className?: string;
  value: string;
  icon: IconNames;
  description: string;
};

const StatsBlock: React.FC<StatsBlockProperties> = ({
  className,
  value,
  icon,
  description,
}) => {
  return (
    <Card
      className={classNames(
        'flex flex-col items-center justify-center py-7',
        className
      )}
    >
      <div className="flex shrink-0">
        <Icon size="lg" name={icon} />
      </div>
      <div className="text-grayN500 font-bold text-lg pt-6">{value}</div>
      <div className="text-grayN100 text-sm pt-4">{description}</div>
    </Card>
  );
};

export default StatsBlock;
