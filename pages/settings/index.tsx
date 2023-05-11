import React from 'react';
import type { NextPage, GetServerSideProps } from 'next';
import Head from 'next/head';

import { GSSPBasic } from 'utils/gsspBasic';
import SettingsView from 'views/SettingsView';
import Layout from 'components/Layout';

export const getServerSideProps: GetServerSideProps = GSSPBasic();

const Settings: NextPage = () => {
  return (
    <>
      <Head>
        <title>BIP Settings</title>
      </Head>
      <Layout stickTop>
        <SettingsView />
      </Layout>
    </>
  );
};

export default Settings;
