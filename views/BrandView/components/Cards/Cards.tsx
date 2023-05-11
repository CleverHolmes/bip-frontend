type CardsProperties = {
  className?: string;
};

const Banner: React.FC<CardsProperties> = ({ className }) => {
  const commonClasses =
    'flex flex-col md:flex-row w-full xl:w-[64rem] mx-auto mb-48 mt-56 gap-16 ';
  return (
    <div className={commonClasses + className}>
      <div className="flex flex-row flex-none xl:h-[15.875rem] items-center justify-start lg:justify-center relative w-full gap-16 flex-wrap mlg:flex-no-wrap">
        <div className="flex items-center justify-center gap-[5px] w-full lg:w-[25rem] h-[16rem] md:h-[15.875rem] bg-top bg-brand-card sm:bg-brand-card-tablet xl:bg-brand-card shadow-box-menu rounded-2xl relative bg-cover">
          <div className="flex flex-col items-start">
            <p className="font-bodyText font-normal text-sm text-grayN100">
              More than
            </p>
            <p className="font-headings font-bold text-6xl text-grayN200">
              50M
            </p>
            <p className="font-bodyText font-normal text-sm text-grayN100">
              Toys sold Globally
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center gap-3 h-[15.875rem] w-full md:w-1/2 lg:w-[18.5rem] bg-left-top bg-brand-card1 shadow-box-menu rounded-2xl relative bg-cover">
          <p className="font-bodyText font-normal text-sm text-grayN100 text-center">
            People’s Choice Award
          </p>
          <h1 className="font-headings font-bold text-3xl text-grayN200 text-center">
            Toy of the Year
          </h1>
          <p className="font-bodyText font-normal text-sm text-grayN100 text-center">
            on 2022
          </p>
        </div>
        <div className="flex flex-col items-center justify-center gap-3 h-[15.875rem] w-full md:w-1/2 lg:w-[18.5rem] bg-left-top bg-brand-card2 shadow-box-menu rounded-2xl relative bg-cover">
          <p className="font-bodyText font-normal text-sm text-grayN100 text-center">
            More than
          </p>
          <h1 className="font-headings font-bold text-3xl text-grayN200 text-center">
            600M
          </h1>
          <p className="font-bodyText font-normal text-sm text-grayN100 text-center">
            Views on TikTok
          </p>
        </div>
      </div>
    </div>
  );
};

export default Banner;
