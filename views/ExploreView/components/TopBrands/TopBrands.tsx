import { useRef } from 'react';
import Image from 'next/image';

import IconButton from 'components/new/IconButton';

const top10Brands = [
  {
    order: 1,
    image: '/images/Image.png',
  },
  {
    order: 2,
    image: '/images/Image.png',
  },
  {
    order: 3,
    image: '/images/Image.png',
  },
  {
    order: 4,
    image: '/images/Image.png',
  },
  {
    order: 5,
    image: '/images/Image.png',
  },
  {
    order: 6,
    image: '/images/Image.png',
  },
  {
    order: 7,
    image: '/images/Image.png',
  },
  {
    order: 8,
    image: '/images/Image.png',
  },
  {
    order: 9,
    image: '/images/Image.png',
  },
  {
    order: 10,
    image: '/images/Image.png',
  },
];

type TopBrandsProperties = {
  className?: string;
};

const TopBrands: React.FC<TopBrandsProperties> = ({ className }) => {
  const commonClasses =
    'flex space-x-16 overflow-x-scroll no-scrollbar whitespace-nowrap pt-16 mb-4 pb-8';
  const ref = useRef(null);

  const scroll = (scrollOffset: any) => {
    ref.current.scrollLeft += scrollOffset;
  };

  return (
    <div className={'flex flex-col relative ' + className}>
      <h3 className="text-grayN300 font-headings font-bold text-xl mb-8">
        Top 10 Brands
      </h3>
      <div className={commonClasses} ref={ref}>
        {top10Brands.map((brand, index) => (
          <div
            className="rounded-full cursor-pointer bg-white w-max relative pl-24 md:pl-32 w-[11.5rem] h-[10.4375rem] md:w-[19.5rem] md:h-[17.5625rem]"
            key={index}
          >
            <p className="font-headings text-8xl md:text-10xl text-accentN300 font-extrabold font-outline-4 absolute left-0 bottom-8 md:bottom-16 z-50 m-0">
              {brand.order}
            </p>
            <div className="border-lg shadow-box-iconButton w-[10rem] h-[10.4375rem] md:w-[17.375rem] md:h-[17.5625rem]">
              <Image
                src={brand.image}
                alt={'brand' + index}
                layout="fill"
                objectFit="contain"
              />
            </div>
          </div>
        ))}
      </div>
      <div className="absolute left-32 top-1/2 hidden lg:block">
        <IconButton
          className="z-50"
          onClick={() => scroll(-200)}
          iconName="Left"
        />
      </div>
      <div className="absolute right-32 top-1/2 hidden lg:block">
        <IconButton
          className="z-50"
          onClick={() => scroll(200)}
          iconName="Right"
        />
      </div>
    </div>
  );
};

export default TopBrands;
