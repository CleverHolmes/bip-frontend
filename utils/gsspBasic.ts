import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetServerSidePropsResult } from 'next/types';

import nextI18NextConfig from 'next-i18next.config';

export const GSSPBasic = <T>(
  getServerSideProps?: GetServerSideProps<T>
): GetServerSideProps<T> => {
  return async (context) => {
    const locale = context.locale || 'en';

    const translations = (await serverSideTranslations(
      locale,
      nextI18NextConfig.i18n.namespaces,
      nextI18NextConfig
    )) as any;

    if (getServerSideProps) {
      return getServerSideProps(context).then(
        (GSSPResult: GetServerSidePropsResult<T>) => {
          if ('props' in GSSPResult) {
            return {
              ...GSSPResult,
              props: { ...GSSPResult.props, ...translations },
            };
          }
          return GSSPResult;
        }
      );
    }

    return { props: { ...translations } as T };
  };
};
