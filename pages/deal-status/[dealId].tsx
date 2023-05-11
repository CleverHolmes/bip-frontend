import type { NextPage, GetServerSideProps } from 'next';
import React from 'react';
import Head from 'next/head';

import { GSSPBasic } from 'utils/gsspBasic';
import Layout from 'components/Layout';
import DealStatusView from 'views/DealStatusView';

export const getServerSideProps: GetServerSideProps = GSSPBasic();

const DealStatus: NextPage = () => {
  return (
    <>
      <Head>
        <title>Deal Status</title>
      </Head>
      <Layout>
        <DealStatusView />
      </Layout>
    </>
  );
};

export default DealStatus;
