import type { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';

import Layout from 'components/new/Layout';
import { GSSPBasic } from 'utils/gsspBasic';
import CompanyView from 'views/CompanyView';

export const getServerSideProps: GetServerSideProps = GSSPBasic();

const Company: NextPage = () => {
  return (
    <>
      <Head>
        <title>BIP Company</title>
      </Head>
      <Layout>
        <CompanyView />
      </Layout>
    </>
  );
};

export default Company;
