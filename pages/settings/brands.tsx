import React from 'react';
import type { NextPage, GetServerSideProps } from 'next';
import Head from 'next/head';

import { GSSPBasic } from 'utils/gsspBasic';
import PropertiesList from 'views/SettingsView/components/PropertiesList';
import SettingsView from 'views/SettingsView';
import Layout from 'components/Layout';

export const getServerSideProps: GetServerSideProps = GSSPBasic();

const Brands: NextPage = () => {
  return (
    <>
      <Head>
        <title>BIP Settings - Brands</title>
      </Head>
      <Layout stickTop>
        <SettingsView>
          <PropertiesList />
        </SettingsView>
      </Layout>
    </>
  );
};

export default Brands;
