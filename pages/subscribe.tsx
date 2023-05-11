import React from 'react';
import Head from 'next/head';
import { GetServerSideProps } from 'next';

import { GSSPBasic } from 'utils/gsspBasic';
import SubscribeView from 'views/SubscribeView/SubscribeView';

export const getServerSideProps: GetServerSideProps = GSSPBasic();

const Subscribe: React.FC = () => {
  return (
    <>
      <Head>
        <title>BIP: Subscribe</title>
      </Head>
      <SubscribeView />
    </>
  );
};

export default Subscribe;
