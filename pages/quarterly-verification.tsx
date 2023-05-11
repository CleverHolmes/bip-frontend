import React from 'react';
import Head from 'next/head';
import { GetServerSideProps } from 'next';

import Layout from 'components/Layout';
import { GSSPBasic } from 'utils/gsspBasic';
import QuarterlyVerificationView from 'views/QuarterlyVerificationView';

export const getServerSideProps: GetServerSideProps = GSSPBasic();

const QuarterlyVerification: React.FC = () => {
  return (
    <>
      <Head>
        <title>Quarterly Verification</title>
      </Head>
      <Layout>
        <QuarterlyVerificationView />
      </Layout>
    </>
  );
};

export default QuarterlyVerification;
