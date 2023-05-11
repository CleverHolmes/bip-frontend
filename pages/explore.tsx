import type { NextPage, GetServerSideProps } from 'next';
import Head from 'next/head';

import Layout from 'components/new/Layout';
import ExploreView from 'views/ExploreView';
import { GSSPBasic } from 'utils/gsspBasic';

export const getServerSideProps: GetServerSideProps = GSSPBasic();

const Explore: NextPage = () => {
  return (
    <>
      <Head>
        <title>Explore Page</title>
      </Head>
      <Layout isFullPage={true}>
        <ExploreView />
      </Layout>
    </>
  );
};

export default Explore;
