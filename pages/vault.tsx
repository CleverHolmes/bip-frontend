import type { NextPage, GetServerSideProps } from 'next';
import Head from 'next/head';
import Layout from 'components/new/Layout';
import VaultView from 'views/VaultView';
import { GSSPBasic } from 'utils/gsspBasic';
// import Vault from './vault_old';

export const getServerSideProps: GetServerSideProps = GSSPBasic();

const Vault: NextPage = () => {
  return (
    <>
      <Head>
        <title>Vault Page</title>
      </Head>
      <Layout isFullPage={true}>
        <VaultView />
      </Layout>
    </>
  );
};

export default Vault;
