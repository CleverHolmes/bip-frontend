import Image from 'next/image';
import { NextRouter, useRouter } from 'next/router';
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'next-i18next';

import {
  findUserByUuid,
  findUserByUuidQueryKey,
} from 'api/user/findUserByUuid';
import { findItems, findItemsQueryKey } from 'api/item/findItems';
import Icon from 'components/new/Icon';
import Button from 'components/new/Button/Button';
import Breadcrumb from 'components/new/Breadcrumb';
import { ItemByUUIDResponse } from 'models/item/item';
import { wholesaleVolumeChoices } from 'public/helpers/data';
import { throwError } from 'utils/error';
import InfoBlock from './components/InfoBlock';
import StatsBlock from './components/StatsBlock';
import CompanyHeader from './components/CompanyHeader';
import routes from 'constants/routes';
import Carousel from '../ExploreView/components/Carousel';

const CompanyView: React.FC = () => {
  const { t } = useTranslation();
  const router: NextRouter = useRouter();
  const { query } = router;

  const { data: company } = useQuery({
    queryKey: [findUserByUuidQueryKey],
    queryFn: async () => {
      const companyQuery = Array.isArray(query?.company)
        ? query?.company[0]
        : query?.company || '';
      if (companyQuery) {
        return await findUserByUuid(companyQuery);
      }
    },
    enabled: !!query.company,
    onError: (err) => {
      throwError(err);
    },
  });

  const { data: companyProducts } = useQuery({
    queryKey: [findItemsQueryKey, findItemsQueryKey],
    queryFn: async () => {
      const params = {
        params: {
          user_uuid: company?.uuid,
          take: 4,
        },
      };
      const items = await findItems(params);
      items
        .filter((item: ItemByUUIDResponse) => item.uuid !== company?.uuid)
        .map((item) => ({
          image_logo: item.image_logo,
          name: item.name,
          user: {
            company_name: 'By: Licensor Name',
          },
        }));
      return items;
    },
    enabled: !!company,
    onError: (err) => {
      throwError(err);
    },
  });

  const breadcrumbLinks = [
    {
      label: t('header.explore'),
      url: routes.explore,
    },
    {
      label: company?.company_name,
      url: null,
    },
  ];

  return (
    <>
      <Breadcrumb links={breadcrumbLinks} />
      <CompanyHeader
        categoryName={company?.categories_licensee_core?.[0]?.category_name}
        logo={company?.company_logo?.uri}
        heroImage="/images/Banner.png"
        companyName={company?.company_name}
        verifiedUser={company?.verified_user}
        bottomRightSlot={
          <Button
            className="xs:w-[14.5rem] w-full"
            iconBefore="DiagonalRight"
            variant="secondary"
            onClick={() => {
              router.push('/new/explore');
            }}
          >
            {t('company.view-current-products')}
          </Button>
        }
      />
      <hr className="h-px mt-32 mb-44 bg-gray-200 border-0 bg-grayN50 invisible sm:visible" />
      <div className="text-xl font-bold leading-8 mb-8">
        {t('company.overview')}
      </div>
      <div className="flex flex-col xs:flex-row gap-5">
        <div className="flex flex-col w-full">
          <div className="text-grayN100 text-base">{company?.about}</div>
        </div>
        <div className="flex flex-col w-full text-sm text-grayN100 gap-16 justify-start lg:justify-center">
          <div className="flex flex-row">
            <div className="flex shrink-0 items-center justify-center">
              <Icon name="CircleCheck" />
            </div>
            <div>
              <strong>{t('company.top-customers')} </strong>
              <span className="capitalize">
                {company?.top_5_customers?.join(', ')}
              </span>
            </div>
          </div>
          {/* TODO: replace with BE data */}
          <div className="flex flex-row">
            <div className="flex shrink-0 items-center justify-center">
              <Icon name="CircleCheck" />
            </div>
            <div>Specialized in toys, manufacturing, and consumerproducts</div>
          </div>
          <div className="flex flex-row">
            <div className="flex shrink-0 items-center justify-center">
              <Icon name="CircleCheck" />
            </div>
            <div>Founded in 1997, 25 years operating</div>
          </div>
          <div className="flex flex-row">
            <div className="flex shrink-0 items-center justify-center">
              <Icon name="CircleCheck" />
            </div>
            <div>Headquarters 963 Shotgun Rd, Sunrise, Florida 33326, US</div>
          </div>
        </div>
      </div>
      <div className="text-xl font-bold leading-8 mb-24 mt-56">
        {t('company.licensee-information')}
      </div>

      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-[1rem]">
          {!!company?.categories && company.categories.length > 0 && (
            <InfoBlock
              title={t('company.product-categories')}
              icon="Categories"
              labels={company?.categories?.map((c) => c.category_name)}
            />
          )}
          {!!company?.territories &&
            company.territories.length > 0 &&
            company.publicly_visible.includes('territories') && (
              <InfoBlock
                title={t('company.available-territories')}
                icon="Planet"
                labels={company?.territories || []}
              />
            )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[1rem]">
          {!!company?.distribution_channels &&
            company.distribution_channels.length > 0 && (
              <div className="flex w-full">
                <InfoBlock
                  title={t('company.distribution-channels')}
                  icon="Truck"
                  className="w-full"
                  labels={company?.distribution_channels || []}
                />
              </div>
            )}

          <div className="flex flex-col sm:flex-row gap-[1rem] w-full">
            {!!company?.annual_wholesale_volume &&
              company.annual_wholesale_volume.length > 0 &&
              company.publicly_visible.includes('annual_wholesale_volume') && (
                <StatsBlock
                  icon="Donut"
                  value={
                    wholesaleVolumeChoices.filter(
                      (item) => item.min === company.annual_wholesale_volume[0]
                    )[0]?.value
                  }
                  className="w-full"
                  description={t('company.wholesale-volume')}
                />
              )}
            {!!company?.active_licensees &&
              company.active_licensees.length > 0 &&
              company.publicly_visible.includes('active_licensees') && (
                <StatsBlock
                  icon="Copyright"
                  value={`${company.active_licensees[0]} - ${company.active_licensees[1]}`}
                  className="w-full"
                  description={t('company.active-licenses')}
                />
              )}
          </div>
        </div>
      </div>

      {/* TODO: Implement current licenses gallery */}
      <hr className="h-px mt-32 mb-17 bg-gray-200 border-0 bg-grayN50" />

      {/* TODO: replace company name with BE prop */}
      {companyProducts && companyProducts.length > 0 && (
        <Carousel
          className="pl-20 md:pl-24"
          carouselName={t('company.more-company-listings')}
          brandList={companyProducts}
        />
      )}
    </>
  );
};

export default CompanyView;
