import React, { FC, ReactNode } from 'react';
import classnames from 'classnames';

import NavMain from 'components/Navbars/NavMain';
import FooterMain from 'components/FooterMain';
import NavBasic from 'components/Navbars/NavBasic';

type Props = {
  children: ReactNode;
  aboveBottomButtons?: boolean;
  border?: boolean;
  simpleHeader?: boolean;
  stickTop?: boolean;
  hideFooter?: boolean;
  hideHeader?: boolean;
  hideContainer?: boolean;
  smallContainerNoMargin?: boolean;
};

const Layout: FC<Props> = ({
  children,
  aboveBottomButtons,
  border,
  simpleHeader,
  stickTop,
  hideFooter,
  hideHeader,
  hideContainer,
  smallContainerNoMargin,
}) => {
  return (
    <>
      {!hideHeader &&
        (simpleHeader ? <NavBasic homePageClick={true} /> : <NavMain />)}
      <div
        className={classnames(
          `relative flex flex-col ${
            smallContainerNoMargin ? 'mx-0' : 'mx-6'
          } lg:mx-auto
          ${border ? 'lg:border-2 border-inputGray/20 rounded-lg my-5' : ''}`,
          {
            'pt-16': !stickTop,
            'pt-5': border,
            'lg:pt-18': !stickTop,
            'mb-10': !hideFooter,
            'h-full': !hideFooter,
            'lg:min-h-screen': !hideFooter,
            'lg:container': !hideContainer,
          }
        )}
      >
        <div className="mx-4">{children}</div>
      </div>
      {!hideFooter && <FooterMain aboveBottomButtons={aboveBottomButtons} />}
    </>
  );
};

export default Layout;
