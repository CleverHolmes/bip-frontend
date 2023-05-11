import Image from 'next/image';

import Icon from 'components/new/Icon';

type Demographics = {
  image_logo: string;
  name: string;
  user: { company_name: string };
};

type DemographicsProperties = {
  className?: string;
};

const Banner: React.FC<DemographicsProperties> = ({ className }) => {
  const commonClasses = 'flex flex-col w-full xl:w-[64rem] md:mx-auto mb-48 ';
  return (
    <div className={commonClasses + className}>
      <div className="flex flex-row justify-between items-center mb-24">
        <h2 className="font-headings font-bold text-xl text-grayN500">
          Demographics
        </h2>
        <Icon name="Menu" size="md" />
      </div>
      <div className="flex flex-col items-start p-24 gap-24 w-full h-full md:h-[14.25rem] bg-white shadow-box-menu rounded-xl">
        <div className="flex flex-row w-full items-center">
          <p className="flex justify-center items-center py-12 px-8 border-b-2 border-blueN300 font-headings font-bold text-sm text-grayN500  w-1/3">
            Target Gender
          </p>
          <p className="flex justify-center items-center py-12 px-8 border-b-2 border-grayN50 font-headings font-semibold text-sm text-grayN100  w-1/3">
            Target Age
          </p>
          <p className="flex justify-center items-center py-12 px-8 border-b-2 border-grayN50 font-headings font-semibold text-sm text-grayN100  w-1/3">
            Target Region
          </p>
        </div>
        <div className="flex flex-col md:flex-row w-full items-start gap-16">
          <div className="flex flex-col justify-center items-center py-24 gap-12 border border-grayN50 rounded-2xl w-full md:w-1/3">
            <p className="font-bodyText font-normal text-base text-grayN500">
              Female
            </p>
            <h2 className="font-headings font-bold text-xl text-grayN500">
              60%
            </h2>
          </div>
          <div className="flex flex-col justify-center items-center py-24 gap-12 border border-grayN50 rounded-2xl w-full md:w-1/3">
            <p className="font-bodyText font-normal text-base text-grayN500">
              Male
            </p>
            <h2 className="font-headings font-bold text-xl text-grayN500">
              30%
            </h2>
          </div>
          <div className="flex flex-col justify-center items-center py-24 gap-12 border border-grayN50 rounded-2xl w-full md:w-1/3">
            <p className="font-bodyText font-normal text-base text-grayN500">
              Non-Binary
            </p>
            <h2 className="font-headings font-bold text-xl text-grayN500">
              10%
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
