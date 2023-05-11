import React from 'react';
import { useTranslation } from 'next-i18next';

import InfoBlock from 'views/CompanyView/components/InfoBlock';

type DealProperties = {
  className?: string;
  categories: string[];
  territories: string[];
};

const Banner: React.FC<DealProperties> = ({
  className,
  categories,
  territories,
}) => {
  const { t } = useTranslation();

  const commonClasses =
    'flex flex-col w-full xl:w-[64rem] xl:mx-auto mb-48 mt-56 ';
  return (
    <div className={commonClasses + className}>
      <h2 className="font-headings font-bold text-xl text-grayN500 mb-24 w-full">
        Deal Details
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-[1rem]">
        <InfoBlock
          title={t('brand-page.desired-product-categories')}
          icon="Categories"
          labels={categories?.map((c) => c)}
        />
        <InfoBlock
          title={t('brand-page.available-territories')}
          icon="Planet"
          labels={territories?.map((c) => c)}
        />
      </div>
    </div>
  );
};

export default Banner;
