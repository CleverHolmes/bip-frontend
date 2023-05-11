import type { NextPage, GetServerSideProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { NextRouter, useRouter } from 'next/router';
import React from 'react';
import { useTranslation } from 'next-i18next';

import { GSSPBasic } from 'utils/gsspBasic';
import routes from 'constants/routes';
import Layout from 'components/Layout';

export const getServerSideProps: GetServerSideProps = GSSPBasic();

const Congrats: NextPage = () => {
  const { t } = useTranslation();
  const router: NextRouter = useRouter();

  return (
    <>
      <Head>
        <title>BIP Congratulations</title>
      </Head>
      <Layout>
        <div className="flex flex-col items-center">
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
          <div className="px-4 py-6 mt-20 mr-5 text-3xl font-bold text-primary lg:text-5xl font-custom1">
            Congratulations
          </div>
          <div className="px-4 py-2 mb-20 mr-5 text-lg text-primary font-custom1">
            Creation completed successfully
          </div>
          <button
            onClick={() => {
              router.push(routes.explore);
            }}
            className={
              'bg-button rounded-full text-white flex justify-center items-center cursor-pointer hover:bg-buttonHover2 hover:shadow-lg focus:bg-buttonHover2 focus:shadow-lg focus:outline-none focus:ring focus:ring-button/50 active:bg-buttonHover2 active:shadow-lg transition duration-150 ease-in-out py-3.5 w-72 font-bold font-custom1 text-xl mt-2'
            }
          >
            {t('go-home-button')}
          </button>
        </div>
      </Layout>
    </>
  );
};

export default Congrats;
