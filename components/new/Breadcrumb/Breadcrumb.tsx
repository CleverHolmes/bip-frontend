import React from 'react';
import Link from 'next/link';

import Icon from 'components/new/Icon';

type BreadcrumbLink = {
  label?: string;
  url: string | null;
};

type BreadcrumbProps = {
  links: BreadcrumbLink[];
  onClick?: () => void;
};

const Breadcrumb: React.FC<BreadcrumbProps> = ({ links, onClick }) => {
  return (
    <>
      {links.length > 0 && (
        <div className="flex flex-row gap-4 mt-32">
          {links.map((link) =>
            link.url ? (
              <Link key={link.label} href={link.url}>
                <a className="flex items-center gap-4">
                  <span className="text-sm text-grayN100 flex gap-4">
                    {link.label}
                    <Icon className="ml-4" name="Right" size="sm" />
                  </span>
                </a>
              </Link>
            ) : (
              <span
                key={link.label}
                className="text-sm text-grayN500 font-bold flex gap-4"
              >
                {link.label}
              </span>
            )
          )}
        </div>
      )}
    </>
  );
};

export default Breadcrumb;
