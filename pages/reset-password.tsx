import React from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { GetServerSideProps } from 'next';

import Layout from 'components/Layout';
import { GSSPBasic } from 'utils/gsspBasic';
import ResetPasswordView from 'views/ResetPasswordView';

export const getServerSideProps: GetServerSideProps = GSSPBasic();

const ResetPassword: React.FC = () => {
  return (
    <>
      <Head>
        <title>Reset Password</title>
      </Head>
      <div className="absolute right-0 overflow-hidden pointer-events-none -bottom-64">
        <Image
          src="/images/BackgroundBlur.svg"
          alt="background-blur"
          width={1353}
          height={524}
          objectPosition="right bottom"
          layout="fixed"
        />
      </div>
      <Layout simpleHeader>
        <ResetPasswordView />
      </Layout>
    </>
  );
};

export default ResetPassword;
