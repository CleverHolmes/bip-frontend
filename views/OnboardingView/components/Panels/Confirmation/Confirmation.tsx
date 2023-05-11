import { NextRouter, useRouter } from 'next/router';
import React, { useContext, useState } from 'react';
import { useTranslation } from 'next-i18next';

import Button from 'components/new/Button';
import Radio from 'components/new/Radio';
import { TabContext } from 'components/new/Tab';
import routes from 'constants/routes';
import useTokensOrCookies from 'contexts/TokensOrCookies';
import { usePatchUser, usePostUser } from 'hooks/api';
import useAuth from 'hooks/useAuth';
import useStorage from 'hooks/useStorage';
import { UserRoles } from 'models/user/user';
import type { UserPostRequest } from 'models/user/user';
import useStore from 'modules/Store';
import { listOfTerritories } from 'public/helpers/data';
import type { AboutYouData } from '../AboutYou/AboutYou.types';
import PanelReviewCard from './Card';
import Card from 'components/new/Card';
import type { YourBrandsData } from '../YourBrands/YourBrands';
import type { CompanyInfoData } from '../CompanyInfo/CompanyInfoProperties.types';
import Link from 'components/new/Link';
import { ActiveLicenseEnum } from '../CompanyInfo/CompanyInfoProperties.types';

export type OnboardingConfirmationData = {
  aboutYou: AboutYouData;
  companyInfo: CompanyInfoData;
  yourBrands: YourBrandsData;
  atAgreed: boolean;
};

type ConfirmationProperties = {
  data: OnboardingConfirmationData;
  onChange: (data: OnboardingConfirmationData) => void;
};

const Confirmation: React.FC<ConfirmationProperties> = ({ data, onChange }) => {
  const router: NextRouter = useRouter();
  const { handleSetAccessToken } = useTokensOrCookies();
  const { setTokens } = useAuth();
  const { setItem } = useStorage();

  const { t } = useTranslation();

  const { setSelectedIndex } = useContext(TabContext);

  const name_first = useStore((state) => state.name_first);
  const name_last = useStore((state) => state.name_last);
  const roles = useStore((state) => state.roles);
  const company_name = useStore((state) => state.company_name);
  const territories = useStore((state) => state.territories);
  const business_years = useStore((state) => state.business_years);
  const brands_represented = useStore((state) => state.brands_represented);
  const active_licenses = useStore((state) => state.active_licensees);
  const user_uuid = useStore((state) => state.userUUID);
  const brand_categories = useStore((state) => state.brand_categories);
  const newUser = useStore((state) => state.newUser);
  const updateNewUser = useStore((state) => state.updateNewUser);
  const userUUID = useStore((state) => state.userUUID);

  const isLicensee = roles.includes(UserRoles.LICENSEE);
  const isAgency = roles.includes(UserRoles.AGENCY);
  const isLicensor = roles.includes(UserRoles.LICENSOR);

  const [isTermsAgreed, setIsTermsAgreed] = useState(false);

  const { mutate: createUser, isLoading: isCreating } = usePostUser({
    onSuccess: (res) => {
      useStore.setState({ logIn: true });
      handleSetAccessToken(res.token);
      if (newUser?.stayLoggedIn) {
        setTokens(res.token);
      } else {
        setItem('access_token', res.token, 'session');
      }
      updateNewUser();
      router.replace(routes.explore);
    },
  });

  const { mutate: updateUser, isLoading: isUpdating } = usePatchUser({
    onSuccess: () => {
      router.replace(routes.explore);
    },
  });

  const onSubmit = () => {
    const data: UserPostRequest = {
      name_first,
      name_last,
      roles,
      company_name,
      territories,
      user_uuid,
      payment_reminder_days_ahead: [1, 5, 15],
      password: newUser?.password,
      email: newUser?.email,
    };
    if (isAgency) {
      data.brands_represented = brands_represented;
    }
    if (isLicensee) {
      data.business_years = business_years;
      data.categories_licensee = brand_categories.map((c) => ({
        category_name: c,
        products: [],
      }));
    }
    if (isLicensor) {
      const licenses =
        active_licenses === ActiveLicenseEnum.upto25
          ? [0, 25]
          : active_licenses === ActiveLicenseEnum.lessThan100
          ? [26, 100]
          : [101, undefined];
      data.active_licensees = licenses;
      data.categories = brand_categories.map((c) => ({
        category_name: c,
        products: [],
      }));
    }

    if (data.password && data.email && !userUUID) {
      createUser(data);
    } else {
      data.user_uuid = userUUID;
      updateUser(data);
    }
  };

  const aboutYou = [
    {
      title: 'Role',
      value: roles.map((r) => r).join(', '),
      key: 1,
    },
    {
      title: 'Name',
      value: [name_first, name_last].join(' '),
      key: 2,
    },
  ];
  const companyInfo: any[] = [];
  const categories: any[] = [];
  const yourBrands = [];

  if (isAgency) {
    companyInfo.push(
      ...[
        {
          title: 'Agency Name',
          value: company_name,
          key: 1,
        },
        {
          title: 'Territories',
          value: territories
            .map(
              (tID) =>
                listOfTerritories.find((terr) => terr.id.toString() === tID)
                  ?.value || 'Unknown'
            )
            .join(', '),
          key: 2,
        },
      ]
    );
    yourBrands.push(
      ...[
        {
          title: 'Brands',
          value: (brands_represented || []).join(', '),
          key: 1,
        },
      ]
    );
  } else if (isLicensee) {
    companyInfo.push(
      ...[
        {
          title: 'Company Name',
          value: company_name,
          key: 1,
        },
        {
          title: 'Territories',
          value: territories
            .map(
              (terrID) =>
                listOfTerritories.find((t) => t.id.toString() === terrID)
                  ?.value || 'Unknown'
            )
            .join(', '),
          key: 2,
        },
        {
          title: 'Years in Business',
          value: business_years,
          key: 3,
        },
      ]
    );
    categories.push(
      ...[
        {
          title: 'Product Categories',
          value: brand_categories.join(', '),
          key: 1,
        },
      ]
    );
  } else {
    companyInfo.push(
      ...[
        {
          title: 'Company Name',
          value: company_name,
          key: 1,
        },
        {
          title: 'Territories',
          value: territories
            .map(
              (terrID) =>
                listOfTerritories.find((t) => t.id.toString() === terrID)
                  ?.value || 'Unknown'
            )
            .join(', '),
          key: 2,
        },
        {
          title: 'Number of licenses',
          value: active_licenses,
          key: 3,
        },
      ]
    );
    categories.push(
      ...[
        {
          title: 'Product Categories',
          value: brand_categories.join(', '),
          key: 1,
        },
      ]
    );
  }

  const bodyItems = {
    aboutYou,
    companyInfo,
    categories,
    yourBrands,
  };

  return (
    <div className="flex flex-col items-start gap-16 w-full max-w-screen-lg mx-auto pt-56">
      <PanelReviewCard
        title={t('onboarding.about-you')}
        bodyItems={bodyItems.aboutYou}
        onEdit={() => setSelectedIndex?.(0)}
      />
      <PanelReviewCard
        title={t('company-info')}
        bodyItems={bodyItems.companyInfo}
        onEdit={() => setSelectedIndex?.(1)}
      />
      <PanelReviewCard
        title={
          isLicensee || isLicensor
            ? t('onboarding.categories')
            : t('onboarding.your-brands')
        }
        bodyItems={
          isLicensee || isLicensor ? bodyItems.categories : bodyItems.yourBrands
        }
        onEdit={() => setSelectedIndex?.(2)}
      />
      <div className="flex flex-row mt-8">
        <Radio
          selected={isTermsAgreed}
          onClick={() => {
            setIsTermsAgreed(!isTermsAgreed);
          }}
        />
        <div className="ml-8 font-bodyText">
          {t('onboarding.i-agree-with-the')}{' '}
          <Link href={routes.termsOfUse} external className="capitalize">
            {isAgency
              ? t('agency')
              : isLicensee
              ? t('licensee')
              : t('licensor')}{' '}
            {t('onboarding.terms')}
          </Link>
        </div>
      </div>

      <div className="h-68" />
      <div className="container fixed bottom-0 left-1/2 -translate-x-1/2 z-50">
        <div className="w-full max-w-7xl mx-auto lg:space-x-9 bg-white">
          <Card className="shadow-box-iconButton rounded-t-xl border border-[#e9e9e9] w-full p-16">
            <div className="flex justify-between">
              <Link href={routes.home}>
                <Button disabled={false} variant="secondary">
                  {t('cancel')}
                </Button>
              </Link>
              <Button
                disabled={!isTermsAgreed || isCreating || isUpdating}
                onClick={onSubmit}
                className="px-40 shadow-box-iconButton"
              >
                {t('onboarding.get-started')}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;
