import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';

import nextI18NextConfig from 'next-i18next.config';

const Custom404 = () => {
  const { t } = useTranslation();
  const router = useRouter();
  return (
    <main className="flex flex-col items-center justify-center w-full h-screen">
      <h1 className="font-extrabold tracking-widest text-button text-9xl font-custom1">
        404
      </h1>
      <div className="absolute px-4 py-2 mb-20 mr-5 text-sm font-bold text-white rounded-full bg-button rotate-12 font-custom1">
        {t('404.title')}
      </div>
      <button
        onClick={() => {
          router.push('/add-product');
        }}
        className={
          'bg-button rounded-full text-white flex justify-center items-center cursor-pointer hover:bg-buttonHover2 hover:shadow-lg focus:bg-buttonHover2 focus:shadow-lg focus:outline-none focus:ring focus:ring-button/50 active:bg-buttonHover2 active:shadow-lg transition duration-150 ease-in-out py-3.5 w-72 font-bold font-custom1 text-xl mt-10'
        }
      >
        {t('go-home-button')}
      </button>
    </main>
  );
};

export async function getStaticProps(ctx: any) {
  const locale = ctx.locale || 'en';

  return {
    props: {
      ...((await serverSideTranslations(
        locale,
        nextI18NextConfig.i18n.namespaces,
        nextI18NextConfig
      )) as any),
    },
  };
}

export default Custom404;
