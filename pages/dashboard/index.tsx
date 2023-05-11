import type { NextPage, GetServerSideProps } from 'next';
import Head from 'next/head';
import React from 'react';

import { GSSPBasic } from 'utils/gsspBasic';
import Layout from 'components/Layout';
import DashboardView from 'views/DashboardView';

export const getServerSideProps: GetServerSideProps = GSSPBasic();

const Dashboard: NextPage = () => {
  return (
    <>
      <Head>
        <title>Dashboard</title>
      </Head>
      <Layout>
        <DashboardView />
      </Layout>
    </>
  );
};

export default Dashboard;
