import type { NextPage, GetServerSideProps } from 'next';
import Head from 'next/head';

import Layout from 'components/new/Layout';
import BrandView from 'views/BrandView';
import { GSSPBasic } from 'utils/gsspBasic';

export const getServerSideProps: GetServerSideProps = GSSPBasic();

const Brand: NextPage = () => {
  return (
    <>
      <Head>
        <title>Brand Page</title>
      </Head>
      <Layout>
        <BrandView />
      </Layout>
    </>
  );
};

export default Brand;
