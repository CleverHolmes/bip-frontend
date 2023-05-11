import React from 'react';
import Head from 'next/head';
import { GetServerSideProps } from 'next';

import Layout from 'components/Layout';
import { GSSPBasic } from 'utils/gsspBasic';
import AddLicensorView from 'views/AddLicensorView';

export const getServerSideProps: GetServerSideProps = GSSPBasic();

const AddClient: React.FC = () => {
  return (
    <>
      <Head>
        <title>Add Licensor</title>
      </Head>
      <Layout>
        <AddLicensorView />
      </Layout>
    </>
  );
};

export default AddClient;
