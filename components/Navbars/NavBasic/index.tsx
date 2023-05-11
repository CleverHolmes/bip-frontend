import Image from 'next/image';
import { NextRouter, useRouter } from 'next/router';
import React, { FC } from 'react';

type Props = {
  homePageClick?: boolean;
};

const NavBasic: FC<Props> = ({ homePageClick }) => {
  const router: NextRouter = useRouter();
  return (
    <div className="container flex pt-10 pl-6 mx-auto">
      <Image
        src="/images/LogoPrimary.svg"
        width={61}
        height={34}
        alt="BIP logo"
        onClick={() =>
          homePageClick ? router.push('/') : router.push('/explore')
        }
        className="cursor-pointer"
      />
    </div>
  );
};

export default NavBasic;
