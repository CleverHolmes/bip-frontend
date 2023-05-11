import React from 'react';
import type { NextPage, GetServerSideProps } from 'next';
import Head from 'next/head';

import { GSSPBasic } from 'utils/gsspBasic';
import AuthorizedUsersView from 'views/SettingsView/components/AuthorizedUsers';
import SettingsView from 'views/SettingsView';
import Layout from 'components/Layout';

export const getServerSideProps: GetServerSideProps = GSSPBasic();

const AuthorizedUsers: NextPage = () => {
  return (
    <>
      <Head>
        <title>BIP Settings - Authorized Users</title>
      </Head>
      <Layout stickTop>
        <SettingsView>
          <AuthorizedUsersView />
        </SettingsView>
      </Layout>
    </>
  );
};

export default AuthorizedUsers;
