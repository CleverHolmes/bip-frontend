import Image from 'next/image';
import { NextRouter, useRouter } from 'next/router';

import useStore from 'modules/Store';

type Brand = {
  image_logo: string;
  name: string;
  user: { company_name: string };
  uuid: string;
  name_slug: string;
};

type BrandCardProperties = {
  className?: string;
  brandInfo: Brand;
};

const BrandCard: React.FC<BrandCardProperties> = ({ className, brandInfo }) => {
  const commonClasses =
    'flex flex-col bg-white rounded-xl shadow-box-iconButton cursor-pointer ';
  const userCurrentType = useStore((state) => state.userCurrentType);
  const router: NextRouter = useRouter();

  return (
    <div
      className={commonClasses + className}
      onClick={() =>
        userCurrentType === 'collaboration'
          ? router.push(
              `/new/brand/${brandInfo.name_slug}/${brandInfo.uuid}?collaboration=true`
            )
          : router.push(`/new/brand/${brandInfo.name_slug}/${brandInfo.uuid}`)
      }
    >
      <div className="w-[9.5rem] h-[9.75rem] sm:w-[10.5rem] sm:h-[9.75rem] md:w-[18.5rem] md:h-[13.9375rem] relative">
        {brandInfo.image_logo && (
          <Image
            src={brandInfo.image_logo}
            alt="brand-image"
            layout="fill"
            objectFit="cover"
          />
        )}
      </div>
      <div className="flex flex-col p-12">
        <h3 className="font-headings lg:font-lg md:font-base text-grayN500 font-bold">
          {brandInfo.name}
        </h3>
        <p className="font-bodyText font-sm text-grayN100">
          {brandInfo.user.company_name}
        </p>
      </div>
    </div>
  );
};

export default BrandCard;
