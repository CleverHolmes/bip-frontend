import React from 'react';
import Head from 'next/head';
import { GetServerSideProps } from 'next';

import Layout from 'components/Layout';
import { GSSPBasic } from 'utils/gsspBasic';
import NotificationSuppressionView from 'views/NotificationSuppressionView';

export const getServerSideProps: GetServerSideProps = GSSPBasic();

const NotificationSuppression: React.FC = () => {
  return (
    <>
      <Head>
        <title>Notification Suppression</title>
      </Head>
      <Layout hideHeader hideFooter>
        <NotificationSuppressionView />
      </Layout>
    </>
  );
};

export default NotificationSuppression;
