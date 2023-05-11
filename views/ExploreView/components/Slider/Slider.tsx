import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';

import SliderControl from './SliderControl';
import Slide from './Slide';
import Button from 'components/new/Button';

type SliderProperties = {
  className?: string;
};

const Slider: React.FC<SliderProperties> = ({ className }) => {
  const { t } = useTranslation();
  const commonClasses =
    'mx-auto w-full h-[23.375rem] md:h-[22.5rem] lg:h-[29.75rem] relative overflow-hidden ';
  const [slideActive, setIsActive] = useState(1);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (!animate) {
      animateTime();
    }
  }, []);

  const handleSlide = (slide: number) => {
    setAnimate(false);
    animateTime();
    setIsActive(slide);
  };

  const animateTime = () => setTimeout(() => setAnimate(true), 500);

  const FirstSlideRight = () => {
    return (
      <div className="flex flex-row space-x-8 h-full absolute right-0 top-0 py-8 z-10 md:z-40 w-full md:w-auto">
        <div className="flex flex-row items-center justify-center space-y-0 space-x-8 md:flex-col md:space-y-8 md:space-x-0 md:h-full w-full md:w-auto">
          <div className="p-32 rounded-lg bg-accentN50 relative h-[6.6875rem] w-[9.5rem] md:h-max md:w-max">
            <div className="duration-700 ease-in-out w-[6.625rem] h-[6.5rem] lg:w-[10rem] lg:h-[10rem] left-24 md:left-0 -top-24 md:top-0 absolute md:relative">
              <Image
                src="/images/Slider/CardSlider.svg"
                layout="fill"
                objectFit="contain"
                alt="Card Slider"
              />
            </div>
            <div className="flex flex-col px-8 py-8 md:px-16 bg-accentN200 absolute w-full md:w-max left-0 bottom-0 md:-left-8 md:bottom-8 z-50 rounded-tr-lg rounded-b-lg">
              <p className="font-bodyText text-white text-xs">
                {t('explorePage.slider.more-than-visits')}
              </p>
              <p className="font-headings text-white text-base font-semibold">
                {t('explorePage.slider.in-roblox')}
              </p>
            </div>
          </div>
          <div className="p-32 rounded-lg bg-secondaryN50 relative h-[6.6875rem] w-[9.5rem] md:h-max md:w-max">
            <div className="w-[6.625rem] h-[6.5rem] lg:w-[10rem] lg:h-[10rem] left-24 md:left-0 -top-24 md:top-0 absolute md:relative">
              <Image
                src="/images/Slider/CardSlider1.svg"
                layout="fill"
                objectFit="contain"
                alt="Card Slider 1"
              />
            </div>
            <div className="flex flex-col px-8 py-8 md:px-16 bg-secondaryN100 absolute  w-full md:w-max left-0 bottom-0 md:-left-8 md:bottom-8 z-50 rounded-tr-lg rounded-b-lg">
              <p className="font-bodyText text-white text-xs">
                {t('explorePage.slider.2nd-most-played-game')}
              </p>
              <p className="font-headings text-white text-base font-semibold">
                {t('explorePage.slider.in-roblox')}
              </p>
            </div>
          </div>
        </div>
        <div className="hidden bg-blueN25 rounded-lg lg:flex h-full justify-center align-center px-32 py-88">
          <div className="w-[10.1875rem] h-[10.5rem] md:w-[13.75rem] md:h-[13.75rem] relative">
            <Image
              src="/images/Slider/CardSlider2.png"
              layout="fill"
              objectFit="contain"
              alt="Card Slider 1"
            />
            <div className="flex flex-col py-8 px-16 bg-blueN75 absolute -left-8 -bottom-24 z-50 rounded-tr-lg rounded-b-lg">
              <p className="font-bodyText text-white text-xs">
                {t('explorePage.slider.most-successful')}
              </p>
              <p className="font-headings text-white text-base font-semibold">
                {t('explorePage.slider.toys-brand-of-2022')}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const SecondSlideRight = () => {
    return (
      <div className="flex h-full items-center justify-center absolute right-0 top-0 px-28 py-64 xl:py-84 xl:px-[7.375rem] z-10 md:z-40 bg-accentN75 rounded-lg w-full md:w-auto">
        <div className="flex flex-row items-center justify-center h-full">
          <div className="w-[20rem] h-[8,75rem] md:w-[14.25rem] md:h-[14.25rem] lg:w-[18.25rem] lg:h-[18.25rem] px-20 pb-36 relative">
            <div className="w-[6.625rem] h-[6.5rem] md:w-[11.75rem] md:h-[11.75rem] lg:w-[16.25rem] lg:h-[16.25rem]">
              <Image
                src="/images/Slider/CardSlider2.png"
                layout="fill"
                objectFit="contain"
                alt="Card Slider 1"
              />
            </div>
            <div className="flex flex-col items-center justify-center py-8 px-8 lg:px-16 bg-accentN300 absolute left-0 bottom-0 w-full z-50 rounded-b-lg">
              <p className="font-bodyText text-white text-xs">
                {t('explorePage.slider.toy-of-the-year-award')}
              </p>
              <p className="font-headings text-white text-base font-semibold">
                {t('explorePage.slider.peoples-choice-awards-2022')}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={commonClasses}>
      <div className="flex w-full absolute bottom-16">
        <SliderControl
          activeSlider={slideActive}
          changeSlider={(slide) => handleSlide(slide)}
        />
      </div>
      {slideActive === 1 && (
        <Slide rightSide={<FirstSlideRight />}>
          <div className="flex justify-center md:justify-start 2xl:justify-center items-start lg:items-center relative h-full">
            <div
              className={
                'absolute -top-32 left-0 w-full duration-700 ease-in-out ' +
                (animate ? 'h-[12.5625rem]' : 'h-0')
              }
            >
              <Image
                src="/images/Slider/Group-11.svg"
                alt="top-bg"
                layout="fill"
              />
            </div>
            <div
              className={
                'absolute bottom-0 left-0  h-[15.375rem] duration-700 ease-in-out ' +
                (animate ? 'w-[26.3125rem]' : 'w-0')
              }
            >
              <Image
                src="/images/Slider/Left-Elements.svg"
                alt="top-bg"
                layout="fill"
              />
            </div>
            <div className="flex flex-col items-center md:items-start ml-24 xl:ml-[8rem] 2xl:ml-0 2xl:items-center z-10">
              <h3 className="font-headings font-medium text-xl md:text-5xl text-grayN500 mt-32 lg:mt-0">
                {t('explorePage.slider.discover-license')}
              </h3>
              <h1 className="font-headings font-bold md:text-7xl text-grayN500 mb-[13rem] md:mb-80">
                {t('explorePage.slider.top-brands')}
              </h1>
              <Button variant="primary" iconBefore="Play">
                {t('explorePage.slider.watch-how-simple-it-is')}
              </Button>
            </div>
          </div>
        </Slide>
      )}
      {slideActive === 2 && (
        <Slide rightSide={<SecondSlideRight />}>
          <div className=" flex justify-center md:justify-start 2xl:justify-center items-center relative h-full">
            <div
              className={
                'absolute -top-32 left-0 w-full duration-700 ease-in-out ' +
                (animate ? 'h-[12.5625rem]' : 'h-0')
              }
            >
              <Image
                src="/images/Slider/Group-11.svg"
                alt="top-bg"
                layout="fill"
              />
            </div>
            <div
              className={
                'absolute bottom-0 left-0 h-[15.375rem] duration-700 ease-in-out ' +
                (animate ? 'w-[26.3125rem]' : 'w-0')
              }
            >
              <Image
                src="/images/Slider/Left-Elements.svg"
                alt="top-bg"
                layout="fill"
              />
            </div>
            <div
              className={
                'absolute xs:max-sm:right-0 -bottom-80 mx-auto w-[32.375rem] duration-700 ease-in-out ' +
                (animate ? 'h-[14.4375rem]' : 'h-0')
              }
            >
              <Image
                src="/images/Slider/Middle-Elements.svg"
                alt="middle-bg"
                layout="fill"
              />
            </div>
            <div className="flex flex-col items-center md:items-start xl:items-center ml-24 xl:ml-[8rem] 2xl:ml-0 z-50">
              <h3 className="font-headings font-medium text-xl md:text-5xl text-grayN500">
                {t('explorePage.slider.brand-of-the-day')}
              </h3>
              <h1 className="font-headings font-bold text-5xl md:text-7xl text-grayN500 mb-[13rem] md:mb-80">
                {t('explorePage.slider.squishmallows')}
              </h1>
              <Button variant="primary">
                {t('explorePage.slider.license-now')}
              </Button>
            </div>
          </div>
        </Slide>
      )}
      {slideActive === 3 && (
        <Slide>
          <div className="flex justify-center items-center relative h-full">
            <div
              className={
                'absolute -top-32 left-0 w-full duration-700 ease-in-out ' +
                (animate ? 'h-[12.5625rem]' : 'h-0')
              }
            >
              <Image
                src="/images/Slider/Group-11.svg"
                alt="top-bg"
                layout="fill"
              />
            </div>
            <div
              className={
                'absolute bottom-0 left-0 h-[15.375rem] duration-700 ease-in-out ' +
                (animate ? 'w-[26.3125rem]' : 'w-0')
              }
            >
              <Image
                src="/images/Slider/Left-Elements.svg"
                alt="top-bg"
                layout="fill"
              />
            </div>
            <div
              className={
                'absolute xs:max-sm:right-0 -bottom-80 mx-auto w-[32.375rem] duration-700 ease-in-out ' +
                (animate ? 'h-[14.4375rem]' : 'h-0')
              }
            >
              <Image
                src="/images/Slider/Middle-Elements.svg"
                alt="middle-bg"
                layout="fill"
              />
            </div>
            <div
              className={
                'hidden md:block absolute bottom-0 right-0 h-[15.375rem] duration-700 ease-in-out ' +
                (animate ? 'w-[26.3125rem]' : 'w-0')
              }
            >
              <Image
                src="/images/Slider/Right-Elements.svg"
                alt="right-bg"
                layout="fill"
              />
            </div>
            <div className="flex flex-col xs:items-center md:items-start z-50">
              <h3 className="font-headings font-medium text-xl md:text-5xl text-grayN500">
                {t('explorePage.slider.have-a-brand')}
              </h3>
              <h1 className="font-headings font-bold text-5xl md:text-7xl text-grayN500 mb-4">
                {t('explorePage.slider.to-list')}
              </h1>
              <p className="font-bodyText text-grayN100 mb-36">
                {t('explorePage.slider.get-the-most-out-of-bip')}
              </p>
              <Button variant="primary">
                {t('explorePage.slider.start-the-listing-process')}
              </Button>
            </div>
          </div>
        </Slide>
      )}
    </div>
  );
};

export default Slider;
