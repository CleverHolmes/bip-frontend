import type { NextPage, GetServerSideProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { scroller } from 'react-scroll';
import { Menu, Transition } from '@headlessui/react';
import React, { Fragment } from 'react';
import { useTranslation } from 'next-i18next';

import Icon from 'components/Icon';
import { GSSPBasic } from 'utils/gsspBasic';
import CardHome from 'components/CardHome';
import FooterMain from 'components/FooterMain';
import HeaderTextButton from 'components/Buttons/HeaderTextButton';
import NavLanding from 'components/Navbars/NavLanding';

export const getServerSideProps: GetServerSideProps = GSSPBasic();

const animationBrands = [
  {
    order: 1,
    name: 'Missing Link',
    companyName: 'Laika',
    image: '/images/Explore/Default.svg',
  },
  {
    order: 2,
    name: 'The Box Trolls',
    companyName: 'Laika',
    image: '/images/Explore/Default2.svg',
  },
  {
    order: 3,
    name: 'ParaNorman',
    companyName: 'Laika',
    image: '/images/Explore/Default3.svg',
  },
  {
    order: 4,
    name: 'Coraline',
    companyName: 'Laika',
    image: '/images/Explore/Default4.svg',
  },
  {
    order: 5,
    name: 'Missing Link',
    companyName: 'Laika',
    image: '/images/Explore/Default.svg',
  },
  {
    order: 6,
    name: 'The Box Trolls',
    companyName: 'Laika',
    image: '/images/Explore/Default2.svg',
  },
  {
    order: 7,
    name: 'ParaNorman',
    companyName: 'Laika',
    image: '/images/Explore/Default3.svg',
  },
  {
    order: 8,
    name: 'Coraline',
    companyName: 'Laika',
    image: '/images/Explore/Default4.svg',
  },
  {
    order: 9,
    name: 'Missing Link',
    companyName: 'Laika',
    image: '/images/Explore/Default.svg',
  },
  {
    order: 10,
    name: 'The Box Trolls',
    companyName: 'Laika',
    image: '/images/Explore/Default2.svg',
  },
];

const appliancesBrands = [
  {
    order: 1,
    name: 'Brand Name',
    companyName: 'Licensor Name',
    image: '/images/Explore/Default5.svg',
  },
  {
    order: 2,
    name: 'Brand Name',
    companyName: 'Licensor Name',
    image: '/images/Explore/Default5.svg',
  },
  {
    order: 3,
    name: 'Brand Name',
    companyName: 'Licensor Name',
    image: '/images/Explore/Default5.svg',
  },
  {
    order: 4,
    name: 'Brand Name',
    companyName: 'Licensor Name',
    image: '/images/Explore/Default5.svg',
  },
  {
    order: 5,
    name: 'Brand Name',
    companyName: 'Licensor Name',
    image: '/images/Explore/Default5.svg',
  },
  {
    order: 6,
    name: 'Brand Name',
    companyName: 'Licensor Name',
    image: '/images/Explore/Default5.svg',
  },
  {
    order: 7,
    name: 'Brand Name',
    companyName: 'Licensor Name',
    image: '/images/Explore/Default5.svg',
  },
  {
    order: 8,
    name: 'Brand Name',
    companyName: 'Licensor Name',
    image: '/images/Explore/Default5.svg',
  },
  {
    order: 9,
    name: 'Brand Name',
    companyName: 'Licensor Name',
    image: '/images/Explore/Default5.svg',
  },
  {
    order: 10,
    name: 'Brand Name',
    companyName: 'Licensor Name',
    image: '/images/Explore/Default5.svg',
  },
];

const Home: NextPage = () => {
  const { t } = useTranslation();
  const scrollToSection = () => {
    scroller.scrollTo('hero-top', {
      duration: 1200,
      delay: 0,
      smooth: 'easeInOutQuart',
    });
  };

  const FadeInSection = (props: any) => {
    const [isVisible, setVisible] = React.useState(false);
    const domRef: any = React.useRef();
    React.useEffect(() => {
      const myRef = domRef.current;
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(entry.isIntersecting);
          }
        });
      });
      observer.observe(domRef.current);
      return () => observer.unobserve(myRef);
    }, []);
    return (
      <div
        className={`fade-in-section sm:px-5 lg:px-28 ${
          isVisible ? 'is-visible' : ''
        }`}
        ref={domRef}
      >
        {props.children}
      </div>
    );
  };

  const FadeInSectionNoMovement = (props: any) => {
    const [isVisible, setVisible] = React.useState(false);
    const domRef: any = React.useRef();
    React.useEffect(() => {
      const myRef = domRef.current;
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(entry.isIntersecting);
          }
        });
      });
      observer.observe(domRef.current);
      return () => observer.unobserve(myRef);
    }, []);
    return (
      <div
        className={`fade-in-section-no-move sm:px-5 lg:px-28 ${
          isVisible ? 'is-visible' : ''
        }`}
        ref={domRef}
      >
        {props.children}
      </div>
    );
  };
  return (
    <>
      <Head>
        <title>BIP - The Future of Licensing</title>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/images/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/images/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/images/favicon-16x16.png"
        />
      </Head>
      <div className="invisible md:visible absolute md:top-[-200px] lg:top-[0px] left-0 z-0 w-full h-full">
        <Image
          src="/images/Home/Blur2.png"
          alt="blur-colors"
          width={1000}
          layout="fill"
          className="opacity-40 animate-pulse"
        />
      </div>
      <div className="flex flex-col min-h-screen">
        <div className="px-4 border-0 bg-primary sm:px-6 md:px-10 xl:px-0">
          <NavLanding />
          <FadeInSectionNoMovement key="hero">
            <div className="grid items-center grid-cols-1 gap-6 my-20 md:mb-0 md:mt-48 lg:mt-20 md:grid-cols-2 hero-top 3xl:container 3xl:mx-auto">
              <div className="z-20 flex flex-col mt-32 sm:mt-40 md:mt-0 lg:mb-28">
                <HeaderTextButton
                  header="Licensing Made Simple"
                  text={`With our marketplace, you can easily discover and collaborate on licensable IP to expand your brand's reach and revenue streams.`}
                  color="white"
                  // button="Sign Up Now"
                  // button2="Log In"
                  bigger={true}
                  // onClick={() => router.push('/signup')}
                  // onClick2={() => router.push('/login')}
                />
              </div>
              <div className="z-20 hidden max-w-screen-xl ml-10 md:inline-block lg:w-192">
                <Image
                  src={`/images/Home/Hero.png`}
                  alt="hero"
                  width="100%"
                  height="100%"
                  layout="responsive"
                  objectFit="contain"
                />
              </div>
            </div>
          </FadeInSectionNoMovement>
        </div>
        <div
          style={{
            position: 'relative',
            width: '100%',
          }}
          className="-mt-10 h-28"
        >
          <div
            style={{
              display: 'inline-block',
              position: 'absolute',
              width: '100%',
              backgroundColor: '#0A0227',
              verticalAlign: 'middle',
              overflow: 'hidden',
              zIndex: -1,
            }}
            className="h-28 rounded-b-[50%] border-b-4 md:border-b-8 border-blue-grey-100 -top-2"
          />
        </div>
        <div className="relative w-full">
          <div className="z-20 flex flex-col items-center justify-center mx-4 mt-10">
            <FadeInSection key="trusted-brands">
              <div
                className={`text-primary font-bold font-custom1 text-lg lg:text-xl mt-10 mb-8 text-center`}
              >
                Trusted by the world’s leading organizations, including
              </div>
              <div className="flex flex-row flex-wrap items-center justify-center max-w-7xl">
                <div className="mx-8">
                  <Image
                    src={`/images/Home/Squishmallows.png`}
                    alt="Squishmallows"
                    width={120}
                    height={120}
                    objectFit="contain"
                    className="mx-12"
                  />
                </div>
                <div className="mx-8">
                  <Image
                    src={`/images/Home/Brookhaven.png`}
                    alt="Brookhaven"
                    width={120}
                    height={120}
                    objectFit="contain"
                    className="mx-12"
                  />
                </div>
                <div className="mx-8">
                  <Image
                    src={`/images/Home/Royal-high.png`}
                    alt="RoyalHigh"
                    width={120}
                    height={120}
                    objectFit="contain"
                    className="mx-12"
                  />
                </div>
                <div className="mx-8">
                  <Image
                    src={`/images/Home/Infinikey.png`}
                    alt="Infinikey"
                    width={90}
                    height={90}
                  />
                </div>
                <div className="mx-8">
                  <Image
                    src={`/images/Home/StrikerEntertainment.png`}
                    alt="Striker"
                    width={120}
                    height={120}
                    objectFit="contain"
                    className="mx-12"
                  />
                </div>
                <div className="mx-8">
                  <Image
                    src={`/images/Home/Evolution.png`}
                    alt="EvolutionManagement"
                    width={120}
                    height={120}
                    objectFit="contain"
                    className="mx-12"
                  />
                </div>
                <div className="mx-8">
                  <Image
                    src={`/images/Home/Jazwares.png`}
                    alt="Jazwares"
                    width={120}
                    height={120}
                    objectFit="contain"
                    className="mx-12"
                  />
                </div>
                <div className="mx-8">
                  <Image
                    src={`/images/Home/Licensing-street.png`}
                    alt="LicensingStreet"
                    width={120}
                    height={120}
                    objectFit="contain"
                  />
                </div>
                <div className="mx-8">
                  <Image
                    src={`/images/Home/Ghsthotels.png`}
                    alt="Ghsthotels"
                    width={120}
                    height={120}
                    objectFit="contain"
                  />
                </div>
                <div className="mx-8">
                  <Image
                    src={`/images/Home/The_brand_liaison.jpg`}
                    alt="The Brand liaison"
                    width={140}
                    height={84}
                  />
                </div>
              </div>
            </FadeInSection>
          </div>
        </div>
        <div
          style={{
            position: 'relative',
            width: '100%',
            backgroundColor: '#0A0227',
          }}
          className="h-28"
        >
          <div
            style={{
              display: 'inline-block',
              position: 'absolute',
              width: '100%',
              backgroundColor: '#FFF',
              verticalAlign: 'middle',
              overflow: 'hidden',
              zIndex: 1,
            }}
            className="h-28 rounded-b-[50%] border-b-4 md:border-b-8 border-blue-grey-100 -top-2"
          />
        </div>
        <div className="px-4 border-0 bg-primary md:pb-12 sm:px-6 md:px-10 xl:px-0">
          <FadeInSection key="brands">
            <div className="container z-20 grid items-center grid-cols-1 gap-6 mx-auto mt-20 md:grid-cols-2 sm:px-6 md:px-10 xl:px-0">
              <div>
                <div className="max-w-lg mx-auto mb-6 md:mb-0 md:mr-14">
                  <Image
                    src={`/images/Home/Brands.png`}
                    alt="brands"
                    width="100%"
                    height="100%"
                    layout="responsive"
                    objectFit="contain"
                  />
                </div>
              </div>

              <div
                className={`text-center md:text-left md:items-start flex flex-col items-start justify-start z-20 h-112`}
              >
                <div
                  className={`text-white font-bold font-custom1 text-4xl lg:text-6xl`}
                >
                  Increased Discoverability:
                </div>
                <div
                  className={`text-white font-custom2 mt-6 mb-2 text-xl lg:text-2xl`}
                >
                  BIP makes it easy for licensees to find the right brands for
                  collaboration, and for brands to find the right partners for
                  product production and distribution.
                </div>
                <div className="ml-2 sm:ml-5 lg:ml-0">
                  <BrandCategories />
                </div>
              </div>
            </div>
          </FadeInSection>
        </div>

        <div
          style={{
            position: 'relative',
            width: '100%',
          }}
          className="h-28"
        >
          <div
            style={{
              display: 'inline-block',
              position: 'absolute',
              width: '100%',
              backgroundColor: '#0A0227',
              verticalAlign: 'middle',
              overflow: 'hidden',
              zIndex: -1,
            }}
            className="h-28 rounded-b-[50%] border-b-4 md:border-b-8 border-blue-grey-100 -top-2"
          />
        </div>
        <div className="relative">
          <FadeInSection key="brand-expression">
            <div className="container z-20 grid items-center grid-cols-1 gap-6 px-4 mx-auto my-20 bg-transparent md:grid-cols-2">
              <div
                className={`text-center md:text-left md:items-start flex flex-col items-start justify-start z-20 h-112`}
              >
                <div
                  className={`text-primary font-bold font-custom1 text-4xl lg:text-6xl`}
                >
                  Realize your True Value:
                </div>
                <div
                  className={`text-primary font-custom2 mt-6 mb-2 text-xl lg:text-2xl`}
                >
                  Our platform allows brands to expose themselves to new
                  licensees and gauge the highest bidder for deals, resulting in
                  increased deal prices.
                </div>
                <div className="ml-2 sm:ml-5 lg:ml-0">
                  <ProductCategories />
                </div>
              </div>

              <div>
                <div className="max-w-lg mx-auto mt-10 md:mt-0 md:ml-14">
                  <Image
                    src={`/images/Home/Partners.png`}
                    alt="partners"
                    width="100%"
                    height="100%"
                    layout="responsive"
                    objectFit="contain"
                  />
                </div>
              </div>
            </div>
          </FadeInSection>

          <div className="container relative flex flex-col items-center mx-auto my-20">
            <FadeInSection key="royalty-report">
              <HeaderTextButton
                header="Seamlessly Find Your Perfect Partner"
                color="primary"
                center={true}
              />
            </FadeInSection>
          </div>
          <FadeInSection key="card-home">
            <div className="container grid grid-cols-1 gap-6 px-4 mx-auto mb-40 md:grid-cols-3 sm:px-6 md:px-10 xl:px-0">
              <CardHome
                image="Pie.svg"
                title="Emerging Brands:"
                text="BIP focuses on on-boarding emerging licensees onto the platform, providing brands with a wider pool of partnership opportunities."
              />
              <CardHome
                image="Brick.svg"
                title="Streamlined Process:"
                text="Our platform simplifies the licensing process, allowing you to manage your deals and agreements in one place. Keep your deals in one place."
              />
              <CardHome
                image="Flame.svg"
                title="Vault:"
                text="The vault puts all your contracts, deal memos, and any other financial statements in one place."
              />
            </div>
          </FadeInSection>
        </div>

        <div className="relative px-4 py-32 md:py-24 bg-gradientHome sm:px-6 md:px-10 xl:px-0">
          <HeaderTextButton
            header="Ready to get started?"
            text="Have the ability to instantly connect with some of the world’s
largest brands and manufacturers"
            color="primary"
            center={true}
          />
          <div className="absolute top-0 left-0 z-10 hidden md:inline-flex">
            <Image
              src={`/images/Home/Blob1.svg`}
              alt="design-attribute"
              width="200px"
              height="200px"
            />
          </div>
          <div className="absolute bottom-0 right-0 z-10 hidden md:inline-flex">
            <Image
              src={`/images/Home/Blob2.svg`}
              alt="design-attribute-2"
              width="200px"
              height="200px"
            />
          </div>
          <div
            className="absolute z-30 cursor-pointer bottom-5 right-5 md:bottom-10 md:right-10 hover:scale-125"
            onClick={() => {
              scrollToSection();
            }}
          >
            <svg
              width="65"
              height="65"
              viewBox="0 0 65 65"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="6"
                y="6"
                width="53"
                height="53"
                rx="26.5"
                fill="#4AA7CA"
              />
              <rect
                x="3"
                y="3"
                width="59"
                height="59"
                rx="29.5"
                stroke="#4AA7CA"
                strokeOpacity="0.2"
                strokeWidth="6"
              />
              <path
                d="M48 41L32 25L16 41"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
        <FooterMain />
      </div>
    </>
  );
};

export default Home;

const brandCategories = [
  { item: 'Entertainment' },
  { item: 'Music' },
  { item: 'Influencer' },
  { item: 'Fashion' },
  { item: 'Toys' },
  { item: 'Games' },
  { item: 'Sports' },
  { item: 'And many more!' },
];

const productsCategories = [
  { item: 'Apparel' },
  { item: 'Accessories' },
  { item: 'Electronics' },
  { item: 'Food & Beverage' },
  { item: 'Health & Beauty...' },
  { item: 'Toys, Games, and many more!' },
];

function BrandCategories() {
  return (
    <Menu>
      <Menu.Button className="flex flex-row items-center justify-center mt-5 mb-5 text-lg font-bold text-white transition duration-150 ease-in-out cursor-pointer font-custom1">
        Brand Categories
        <Icon
          name="ChevronDown"
          className={`fill-white cursor-pointer ml-2 mt-2`}
          viewBox="0 0 18 18"
          size="18"
        />
      </Menu.Button>
      <Transition
        enter="transition duration-200 ease-out"
        enterFrom="transform scale-85 opacity-0"
        enterTo="transform scale-100 opacity-100"
        leave="transition duration-200 ease-out"
        leaveFrom="transform scale-100 opacity-100"
        leaveTo="transform scale-85 opacity-0"
      >
        <Menu.Items className="grid grid-cols-2 px-6 py-4 rounded-lg shadow-lg bg-light w-80 sm:w-96">
          {brandCategories.map((i) => (
            <Menu.Item key={i.item} as={Fragment}>
              <div className="col-span-1 py-2 text-sm text-left text-primary lg:text-base font-custom1">
                {i.item}
              </div>
            </Menu.Item>
          ))}
        </Menu.Items>
      </Transition>
    </Menu>
  );
}

function ProductCategories() {
  return (
    <Menu>
      <Menu.Button className="flex flex-row items-center justify-center mt-5 mb-5 text-lg font-bold transition duration-150 ease-in-out cursor-pointer text-primary font-custom1">
        Product Categories
        <Icon
          name="ChevronDown"
          className={`fill-primary cursor-pointer ml-2 mt-2`}
          viewBox="0 0 18 18"
          size="18"
        />
      </Menu.Button>
      <Transition
        enter="transition duration-200 ease-out"
        enterFrom="transform scale-85 opacity-0"
        enterTo="transform scale-100 opacity-100"
        leave="transition duration-200 ease-out"
        leaveFrom="transform scale-100 opacity-100"
        leaveTo="transform scale-85 opacity-0"
      >
        <Menu.Items className="grid grid-cols-2 px-6 py-4 rounded-lg shadow-lg bg-light w-80 sm:w-96">
          {productsCategories.map((i) => (
            <Menu.Item key={i.item} as={Fragment}>
              <div className="col-span-1 py-2 text-sm text-left text-primary lg:text-base font-custom1">
                {i.item}
              </div>
            </Menu.Item>
          ))}
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
