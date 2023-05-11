import Image from 'next/image';

import Icon from 'components/new/Icon';


type AboutProperties = {
  className?: string;
};

const About: React.FC<AboutProperties> = ({ className }) => {
  const commonClasses = 'flex flex-col w-full xl:w-[64rem] md:mx-auto mb-48 ';
  return (
    <div className={commonClasses + className}>
      <div className="flex flex-row justify-between items-center mb-24">
        <h2 className="font-headings font-bold text-xl text-grayN500">
          About Squishmallows
        </h2>
        <Icon name="Menu" size="md" />
      </div>
      <div className="flex flex-col md:flex-row gap-32 md:gap-16 w-full">
        <p className="w-full md:w-full font-bodyText font-normal text-base text-grayN100">
          Squishmallows is a brand of stuffed toy that was launched in 2017 by
          Kelly Toys Holdings LLC. Squishmallows are round and come in a variety
          of colors, sizes, animals, and textures. The brand has created over
          1,000 Squishmallows characters with unique names and background
          stories.
        </p>
        {/*<div className="flex flex-col w-full md:w-1/2 justify-start gap-16">
          <div className="flex flex-row items-center gap-8">
            <Icon name="Check" size="sm" />
            <p className="font-bodyText font-normal text-base text-grayN100">
              <span className="font-bold">2017, </span>
              National Parenting Product Awards
            </p>
          </div>
          <div className="flex flex-row items-center gap-8">
            <Icon name="Check" size="sm" />
            <p className="font-bodyText font-normal text-base text-grayN100">
              <span className="font-bold">2018, </span>
              National Parenting Product Award
            </p>
          </div>
          <div className="flex flex-row items-center gap-8">
            <Icon name="Check" size="sm" />
            <p className="font-bodyText font-normal text-base text-grayN100">
              <span className="font-bold">2022, </span>
              Toy of the Year Award, People’s choice award
            </p>
          </div>
        </div>*/}
      </div>
    </div>
  );
};

export default About;
