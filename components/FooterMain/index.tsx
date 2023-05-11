import React from 'react';
import Image from 'next/image';
import { NextRouter, useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';

import Button from 'components/Buttons/Button';
import routes from 'constants/routes';

const FooterMain = ({
  aboveBottomButtons,
}: {
  aboveBottomButtons?: boolean;
}) => {
  const router: NextRouter = useRouter();
  const { t } = useTranslation();
  return (
    <div
      className={`container flex flex-col items-center px-3 pt-6 mx-auto mt-auto md:flex-row md:justify-between lg:pt-12 ${
        aboveBottomButtons ? ' pb-32 sm:pb-32 lg:pb-32' : ' pb-6 lg:pb-8'
      }`}
    >
      <div className="flex items-end">
        <Image
          src="/images/LogoPrimary.svg"
          width={48}
          height={24}
          alt="BIP logo"
          onClick={() => router.push('/explore')}
          className="cursor-pointer"
        />
        <div className="hidden md:inline-flex">
          <div className="ml-4 text-sm font-custom2 text-inputGray">
            © {t('footer.2023-bipmarket-all-rights-reserved')}.
          </div>
        </div>
      </div>
      <div className="flex flex-col m-4 md:flex-row md:m-0 items-center gap-4">
        <Link href={routes.privacyPolicy}>
          <a target="_blank">
            <div className="mx-2 text-base font-semibold text-center cursor-pointer text-primary hover:text-button font-custom1">
              {t('privacy-policy')}
            </div>
          </a>
        </Link>
        <Link href={routes.licensorTerms}>
          <a target="_blank">
            <div className="mx-2 text-base font-semibold text-center cursor-pointer text-primary hover:text-button font-custom1">
              {t('licensor-terms')}
            </div>
          </a>
        </Link>
        <Link href={routes.licenseeTerms}>
          <a target="_blank">
            <div className="mx-2 text-base font-semibold text-center cursor-pointer text-primary hover:text-button font-custom1">
              {t('licensee-terms')}
            </div>
          </a>
        </Link>
        <a
          href="mailto:support@bip.co"
          className="ml-3 text-primary text-base font-semibold cursor-pointer hover:text-button font-custom1"
        >
          support@bip.co
        </a>
        <Button smaller className="ml-3 px-6">
          <a href={`tel: ${t('footer.phone-number')}`}>
            {t('footer.tech-support')}
            <div>
              {t('footer.call')}
              <b> {t('footer.phone-number')} </b>
              {t('footer.time')}
            </div>
          </a>
        </Button>
      </div>
      <div className="inline-flex text-center md:hidden">
        <div className="ml-4 font-custom2 text-inputGray">
          © {t('footer.2023-bipmarket-all-rights-reserved')}.
        </div>
      </div>
    </div>
  );
};

export default FooterMain;
