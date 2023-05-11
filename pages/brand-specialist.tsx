import type { NextPage, GetServerSideProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { NextRouter, useRouter } from 'next/router';
import React from 'react';
import { useTranslation } from 'next-i18next';
import { InlineWidget } from 'react-calendly';

import { GSSPBasic } from 'utils/gsspBasic';
import Layout from 'components/Layout';

export const getServerSideProps: GetServerSideProps = GSSPBasic();

const BrandSpecialist: NextPage = () => {
  const { t } = useTranslation();
  const router: NextRouter = useRouter();

  return (
    <>
      <Head>
        <title>Brand Specialist</title>
      </Head>
      <Layout>
        <div className="fixed bottom-0 right-0 overflow-hidden pointer-events-none">
          <Image
            src="/images/BackgroundBlur.svg"
            alt="background-blur"
            width={1353}
            height={524}
            objectPosition="right bottom"
            layout="fixed"
          />
        </div>
        <div className="text-xl font-bold text-primary lg:text-4xl font-custom1 max-w-[860px] mx-auto text-center">
          {t('brand-specialist.brand-header')}
        </div>
        <div className="mt-5 mb-10 text-lg lg:text-xl lg:mb-0 text-primary font-custom1 rounded-base max-w-[860px] mx-auto text-center">
          {t('brand-specialist.brand-text')}
        </div>
        <InlineWidget url="https://calendly.com/bcohen-34" />
      </Layout>
    </>
  );
};

export default BrandSpecialist;
