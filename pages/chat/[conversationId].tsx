import type { NextPage, GetServerSideProps } from 'next';
import React from 'react';
import Head from 'next/head';

import { GSSPBasic } from 'utils/gsspBasic';
import ChatView from 'views/ChatView';
import Layout from 'components/Layout';

export const getServerSideProps: GetServerSideProps = GSSPBasic();

const Chat: NextPage = () => {
  return (
    <>
      <Head>
        <title>Chat</title>
      </Head>
      <Layout
        stickTop
        hideFooter
        hideContainer
        smallContainerNoMargin
      >
        <ChatView />
      </Layout>
    </>
  );
};

export default Chat;
