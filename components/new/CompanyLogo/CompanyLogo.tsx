import React from 'react';
import Image from 'next/image';

import Initials from 'components/new/Initials';
import customImageLoader from 'utils/image-loader';

type CompanyLogoProperties = {
  className?: string;
  src: string;
  altTitle?: string;
  companyName: string;
  onClick?: (str: string) => void;
};

const CompanyLogo: React.FC<CompanyLogoProperties> = ({
  className,
  src,
  altTitle,
  companyName,
  onClick,
}) => {
  const commonClasses =
    'relative w-36 min-w-36 h-36 cursor-pointer rounded-full overflow-hidden border-solid border-white hover:opacity-60 ' +
    (src ? 'border-1 ' : ' ') +
    className;
  return (
    <div>
      {src && (
        <div className={commonClasses}>
          <div className="shadow-box-modal w-full h-full">
            <Image
              loader={customImageLoader}
              src={src}
              alt={altTitle}
              objectFit="contain"
              width="100%"
              height="100%"
            />
          </div>
        </div>
      )}
      {!src && (
        <Initials
          name={companyName}
          size={36}
          className="hover:opacity-60 whitespace-nowrap"
        />
      )}
    </div>
  );
};

export default CompanyLogo;
