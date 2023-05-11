import React from 'react';

import Chip from 'components/new/Chip';

type CategoriesProps = {
  categories: Array<string>;
  activeCategories: Array<string>;
  onCategoryClick: (cat: string) => void;
};

const CategoryList: React.FC<CategoriesProps> = ({
  categories,
  activeCategories,
  onCategoryClick,
}) => (
  <div className="flex flex-row flex-wrap gap-x-2 gap-y-3">
    {categories.map((cat) => (
      <Chip
        key={cat}
        label={cat}
        selected={activeCategories?.includes(cat)}
        className={'h-32'}
        removable={false}
        onClick={() => onCategoryClick(cat)}
      />
    ))}
  </div>
);

export default CategoryList;
