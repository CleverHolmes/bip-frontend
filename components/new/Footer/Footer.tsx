import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';

type FooterProperties = {
  className?: string;
};

const Footer: React.FC<FooterProperties> = ({ className }) => {
  const { t } = useTranslation();
  const commonClasses =
    'flex flex-col md:flex-row items-center md:justify-between mx-auto py-24 border-t-2 border-t-grayN50 w-full relative px-24 ' +
    className;
  return (
    <footer className={commonClasses}>
      <div className="mb-24 md:mb-0 md:ml-8 md:w-1/3">
        <Image src="/images/new-logo.svg" alt="" width="40" height="26" />
      </div>
      <p className="text-grayN75 text-center font-bodyText text-sm mb-16 md:mb-0 md:w-1/3">
        &copy;, {t('newFooter.bipmarket-all-rights-reserved')}
      </p>
      <div className="flex flex-row md:w-1/3">
        <div className="flex ml-auto">
          <div className="font-bold font-headings text-sm text-grayN500 mr-24">
            <Link href="/">{t('newFooter.privacy-policy')}</Link>
          </div>
          <div className="font-bold font-headings text-sm text-grayN500">
            <Link href="/">{t('newFooter.terms-use')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
