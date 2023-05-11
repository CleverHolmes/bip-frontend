import React from 'react';
import type { NextPage, GetServerSideProps } from 'next';
import Head from 'next/head';

import { GSSPBasic } from 'utils/gsspBasic';
import UserProfile from 'views/SettingsView/components/UserProfile';
import SettingsView from 'views/SettingsView';
import Layout from 'components/Layout';

export const getServerSideProps: GetServerSideProps = GSSPBasic();

const Profile: NextPage = () => {
  return (
    <>
      <Head>
        <title>BIP Settings - Profile</title>
      </Head>
      <Layout stickTop>
        <SettingsView>
          <UserProfile />
        </SettingsView>
      </Layout>
    </>
  );
};

export default Profile;
