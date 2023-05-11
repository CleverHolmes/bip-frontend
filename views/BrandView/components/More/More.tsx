import Image from 'next/image';

import Icon from 'components/new/Icon';

type More = {
  image_logo: string;
  name: string;
  user: { company_name: string };
};

type MoreProperties = {
  className?: string;
};

const More: React.FC<MoreProperties> = ({ className }) => {
  const commonClasses = 'flex flex-col w-full lg:w-[64rem] lg:mx-auto mb-48 ';
  return (
    <div className={commonClasses + className}>
      <h2 className="font-headings font-bold text-xl text-grayN500 mb-24">
        More Company Listings
      </h2>
    </div>
  );
};

export default More;
