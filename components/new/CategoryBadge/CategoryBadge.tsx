import React from 'react';
import classNames from 'classnames';

type CategoryBadgeProperties = {
  label: string;
  className?: string;
};

const CategoryBadge: React.FC<CategoryBadgeProperties> = ({
  label,
  className,
}) => (
  <div
    className={classNames(
      'bg-blueN300 border-2 border-l-0 py-4 pr-28 pl-20 text-white border-white font-bodyText rounded-r-3xl',
      className
    )}
  >
    {label}
  </div>
);

export default CategoryBadge;
