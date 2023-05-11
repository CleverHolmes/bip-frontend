import React from 'react';
import type { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';

import { GSSPBasic } from 'utils/gsspBasic';
import Layout from 'components/Layout';
import ProductView from 'views/ProductView';

export const getServerSideProps: GetServerSideProps = GSSPBasic();

const Product: NextPage = () => {
  return (
    <>
      <Head>
        <title>BIP Brand</title>
      </Head>
      <Layout aboveBottomButtons border stickTop>
        <ProductView />
      </Layout>
    </>
  );
};

export default Product;
