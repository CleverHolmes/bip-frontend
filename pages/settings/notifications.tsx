import React from 'react';
import type { NextPage, GetServerSideProps } from 'next';
import Head from 'next/head';

import { GSSPBasic } from 'utils/gsspBasic';
import NotificationsView from 'views/SettingsView/components/Notifications';
import SettingsView from 'views/SettingsView';
import Layout from 'components/Layout';

export const getServerSideProps: GetServerSideProps = GSSPBasic();

const Notifications: NextPage = () => {
  return (
    <>
      <Head>
        <title>BIP Settings - Notifications</title>
      </Head>
      <Layout stickTop>
        <SettingsView>
          <NotificationsView />
        </SettingsView>
      </Layout>
    </>
  );
};

export default Notifications;
