import React from 'react';
import Image from 'next/image';

import CategoryBadge from 'components/new/CategoryBadge';
import { HeroImage } from 'components/new/HeroImage';
import customImageLoader from 'utils/image-loader';
import VerifiedMark from 'components/new/VerifiedMark';
import { user } from 'models/item/item';
import { useTranslation } from 'next-i18next';

type InfoBlockProperties = {
  categoryName?: string;
  logo?: string;
  heroImage?: string;
  companyName?: string;
  verifiedUser?: boolean;
  user?: user;
  bottomRightSlot?: React.ReactNode;
};

const CompanyHeader: React.FC<InfoBlockProperties> = ({
  categoryName,
  logo,
  heroImage,
  companyName,
  verifiedUser,
  user,
  bottomRightSlot,
}) => {
  const { t } = useTranslation();
  const logoClasses =
    'shadow-clogo ml-16 sm:ml-16 md:ml-32 lg:ml-40 -mt-16 sm:-mt-28 md:-mt-40 relative border-2 md:border-4 border-white rounded-full bg-white w-56 sm:w-88 md:w-128 h-56 sm:h-88 md:h-128 shrink-0';

  return (
    <div className="flex flex-col pt-9">
      <div className="relative">
        {categoryName && (
          <CategoryBadge
            label={categoryName}
            className="absolute -top-20 md:top-16"
          />
        )}
        <HeroImage backgroundUrl={heroImage || ''} />
        {user && (
          <div className="flex flex-col gap-4 absolute justify-end items-end bottom-8 right-8 p-8 w-max bg-white/[.7] rounded-xl">
            <div className="font-bodyText font-normal text-xs text-grayN500">
              {t('brand-page.represented-by')}
            </div>
            <div className="flex flex-row items-center gap-4">
              {user?.company_logo.uri && (
                <div className="w-28 h-28 sm:w-40 sm:h-40 relative">
                  <Image
                    className="rounded-xl"
                    src={user?.company_logo.uri}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
              )}
              <h3 className="font-headings font-bold text-lg text-grayN500">
                {user?.company_name}
              </h3>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col md:flex-row justify-start md:gap-40">
        {!!logo && (
          <div className={logoClasses}>
            <Image
              className="rounded-full border-white w-full h-full"
              src={logo}
              loader={customImageLoader}
              alt="company-logo"
              layout="fill"
              objectFit="contain"
            />
          </div>
        )}
        <div className="mt-12 sm:-mt-32 md:mt-0 md:pt-32 gap-32 md:gap-16 flex flex-col md:flex-row justify-between w-full items-center flex-wrap">
          <div className="flex flex-col gap-4 items-center lg:items-start">
            <div className="flex items-center gap-2">
              <div className="text-3xl font-bold leading-10 text-center lg:text-left md:whitespace-nowrap">
                {companyName}
              </div>
              <VerifiedMark show={verifiedUser} />
            </div>
          </div>
          {!!bottomRightSlot && bottomRightSlot}
        </div>
      </div>
    </div>
  );
};

export default CompanyHeader;
