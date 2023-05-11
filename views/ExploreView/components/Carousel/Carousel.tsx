import { useRef } from 'react';

import BrandCard from 'components/new/BrandCard';
import IconButton from 'components/new/IconButton';

type brand = {
  image_logo: string;
  name: string;
  user: { company_name: string };
  uuid: string;
  name_slug: string;
};

type CarouselProperties = {
  className?: string;
  carouselName: string;
  brandList: brand[];
};

const Carousel: React.FC<CarouselProperties> = ({
  className,
  carouselName,
  brandList,
}) => {
  const commonClasses =
    'flex space-x-8 md:space-x-16 overflow-x-scroll no-scrollbar overflow-y-visible py-12 transition-all ';
  const ref = useRef<HTMLInputElement>(null);

  const scroll = (scrollOffset: number) => {
    if (ref.current) ref.current.scrollLeft += scrollOffset;
  };

  return (
    <div className={'flex flex-col my-32 relative ' + className}>
      <div className="flex flex-row items-center justify-between my-12 w-full pr-20 md:pr-24">
        <h3 className="text-grayN300 font-headings font-bold text-xl">
          {carouselName}
        </h3>
        <span className="text-grayN500 text-base font-bodyText underline cursor-pointer">
          View All
        </span>
      </div>
      <div className={commonClasses} ref={ref}>
        {brandList.map((brand, index) => (
          <BrandCard key={index} brandInfo={brand} />
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

export default Carousel;
