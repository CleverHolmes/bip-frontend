import Image from 'next/image';

import Icon from 'components/new/Icon';

type Social = {
  image_logo: string;
  name: string;
  user: { company_name: string };
};

type SocialProperties = {
  className?: string;
};

const Banner: React.FC<SocialProperties> = ({ className }) => {
  const commonClasses = 'flex flex-col w-full md:w-[64rem] md:mx-auto mb-48 ';
  return (
    <div className={commonClasses + className}>
      <div className="flex flex-row justify-between items-center mb-24">
        <h2 className="font-headings font-bold text-xl text-grayN500">
          Social Impact
        </h2>
        <Icon name="Menu" size="md" />
      </div>
      <div className="flex flex-col sm:flex-row flex-wrap gap-16">
        <div className="flex flex-row items-start justify-center p-24 gap-24 w-full md:w-[calc(50%-1rem)] xl:w-[25rem] h-[6.5rem] bg-white shadow-box-iconButton rounded-xl">
          <div className="flex flex-row justify-between w-full items-center gap-16">
            <div className="flex flex-row items-center gap-24">
              <Icon name="Group" size="xl" color="#8CA7E6" />
              <h3 className="font-headings font-bold text-lg text-grayN500">
                Total Followers
              </h3>
            </div>
            <div className="flex flex-col justify-center items-center gap-8">
              <h2 className="font-headings font-bold text-xl text-grayN500">
                2.6M
              </h2>
              <div className="flex flex-row items-center gap-2">
                <Icon name="Top" size="xxs" color="#00B813" />
                <p className="font-bodyText font-normal text-sm text-grayN100">
                  4.7k
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center px-16 pt-16 gap-8 w-full md:w-[calc(50%-1rem)] xl:w-[12rem] h-[6.5rem] bg-white shadow-box-iconButton rounded-xl">
          <div className="flex flex-row justify-center items-center gap-16">
            <Icon name="Instagram" size="xl" />
            <div className="flex flex-col justify-center items-center gap-4">
              <h2 className="font-headings font-bold text-2xl text-grayN500">
                1.2M
              </h2>
              <div className="flex flex-row items-center gap-2">
                <Icon
                  className="rotate-180"
                  name="Top"
                  size="xxs"
                  color="#BE0000"
                />
                <p className="font-bodyText font-normal text-sm text-grayN100">
                  1.2k
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-row justify-center items-center pt-4 gap-0.5 border-t border-grayN50">
            <Icon name="DiagonalRight" size="sm" />
            <p className="font-headings font-semibold text-sm text-grayN500">
              @squishmallows
            </p>
          </div>
        </div>
        <div className="flex flex-row items-center px-16 py-24 gap-8 w-full md:w-[calc(50%-1rem)] xl:w-[12rem] h-[6.5rem] bg-white shadow-box-iconButton rounded-xl">
          <div className="flex flex-row justify-center items-center w-full gap-16">
            <Icon name="Youtube" size="xl" />
            <div className="flex flex-col justify-center items-center gap-4">
              <h2 className="font-headings font-bold text-2xl text-grayN500">
                187k
              </h2>
              <div className="flex flex-row items-center gap-2">
                <Icon name="Top" size="xxs" color="#00B813" />
                <p className="font-bodyText font-normal text-sm text-grayN100">
                  1.6k
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-row items-center px-16 py-24 gap-8 w-full md:w-[calc(50%-1rem)] xl:w-[12rem] h-[6.5rem] bg-white shadow-box-iconButton rounded-xl">
          <div className="flex flex-row justify-center items-center w-full gap-16">
            <Icon name="Twitter" size="xl" />
            <div className="flex flex-col justify-center items-center gap-4">
              <h2 className="font-headings font-bold text-2xl text-grayN500">
                146k
              </h2>
              <div className="flex flex-row items-center gap-2">
                <Icon name="Top" size="xxs" color="#00B813" />
                <p className="font-bodyText font-normal text-sm text-grayN100">
                  350
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
