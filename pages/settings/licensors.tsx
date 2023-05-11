import React from 'react';
import type { NextPage, GetServerSideProps } from 'next';
import Head from 'next/head';

import { GSSPBasic } from 'utils/gsspBasic';
import AgentLicensors from 'views/SettingsView/components/AgentLicensors';
import SettingsView from 'views/SettingsView';
import Layout from 'components/Layout';

export const getServerSideProps: GetServerSideProps = GSSPBasic();

const Licensors: NextPage = () => {
  return (
    <>
      <Head>
        <title>BIP Settings - Licensors</title>
      </Head>
      <Layout stickTop>
        <SettingsView>
          <AgentLicensors />
        </SettingsView>
      </Layout>
    </>
  );
};

export default Licensors;
