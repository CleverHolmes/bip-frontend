import Header from 'components/new/Header';
import Footer from 'components/new/Footer';

type LayoutProperties = {
  children: React.ReactNode;
  isFullPage?: boolean;
  hideFooter?: boolean;
  hideHeader?: boolean;
  maxWidth?: string;
};

const Layout: React.FC<LayoutProperties> = ({
  children,
  isFullPage = false,
  hideFooter = false,
  hideHeader = false,
}) => {
  const commonClasses = 'flex flex-col mx-auto 2lg:px-0';
  const contentClasses =
    'flex-1 w-full mx-auto ' +
    (isFullPage ? 'px-auto max-w-full' : 'px-24 max-w-[67rem]');
  return (
    <div className={commonClasses}>
      {!hideHeader && <Header />}
      <main className={contentClasses}>{children}</main>
      {!hideFooter && <Footer />}
    </div>
  );
};

export default Layout;
