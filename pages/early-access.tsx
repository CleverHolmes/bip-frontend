import type { NextPage, GetServerSideProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { NextRouter, useRouter } from 'next/router';
import React, { useState } from 'react';
import { useCookies } from 'react-cookie';
import { useTranslation } from 'next-i18next';
import MailchimpSubscribe from 'react-mailchimp-subscribe';

import Button from 'components/Buttons/Button';
import { typeOfUser } from 'public/helpers/data';
import { GSSPBasic } from 'utils/gsspBasic';
import routes from 'constants/routes';
import Layout from 'components/Layout';

export const getServerSideProps: GetServerSideProps = GSSPBasic();

const EarlyAccess: NextPage = () => {
  const { t } = useTranslation();
  const [cookies] = useCookies(['access_token']);
  const router: NextRouter = useRouter();

  const url =
    'https://bipmarket.us8.list-manage.com/subscribe/post?u=52a9aed0315ae3ecbe9a015f8&amp;id=a62af78fb9&amp;f_id=00887de0f0';

  return (
    <>
      <Head>
        <title>BIP Join Early Access</title>
      </Head>
      <Layout simpleHeader smallContainerNoMargin stickTop>
        <div className="flex flex-col items-center">
          <div className="fixed bottom-0 right-0 overflow-hidden pointer-events-none">
            <Image
              src="/images/BackgroundBlur.svg"
              alt="background-blur"
              width={1353}
              height={524}
              objectPosition="right bottom"
              layout="fixed"
            />
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div>
              <div className="px-4 py-6 mr-5 text-3xl font-bold lg:mt-20 text-primary lg:text-5xl font-custom1">
                A hub to connect, discover, and transact with the world’s
                hottest brands
              </div>
              <div className="px-4 py-2 mb-6 mr-5 text-lg lg:mb-20 text-primary font-custom1">
                Join us in the beta launch of BIP, the revolutionary marketplace
                connecting licensees and licensors for collaboration, category
                extension, and territory expansion. We are on the brink of
                launching this game-changing technology and we need your help to
                make it a success. By participating in the beta launch, you'll
                have the opportunity to shape the future of the platform.
                Additionally, we can even design a custom brand page for you on
                the site. Be a part of something big and help us revolutionize
                the industry.
              </div>
            </div>
            <MailchimpSubscribe
              url={url}
              render={({ subscribe, status, message }) => (
                <CustomForm
                  status={status}
                  message={message}
                  onValidated={(formData: any) => subscribe(formData)}
                />
              )}
            />
          </div>
        </div>
      </Layout>
    </>
  );
};

export default EarlyAccess;

// a basic form
const CustomForm = ({ status, message, onValidated }: any) => {
  let email: HTMLInputElement | null;
  let companyName: HTMLInputElement | null;
  let name: HTMLInputElement | null;

  const [state, setState] = React.useState<{ selections: string[] }>({
    selections: [],
  });

  const [error, setError] = useState<string>('');

  const submit = () => {
    if (
      email &&
      email.value.indexOf('@') > -1 &&
      state.selections.length > 0 &&
      !!companyName?.value &&
      !!name?.value
    ) {
      setError('');
      onValidated({
        EMAIL: email.value,
        COMPANY_NAME: companyName?.value,
        NAME: name?.value,
        CATEGORY: state.selections.toString(),
      });
    } else if (email && email.value.indexOf('@') <= -1) {
      setError('*Please enter a valid email');
    } else {
      setError('*Please fill in all fields');
    }
  };

  function handleCheckboxChange(key: string) {
    let sel = state.selections;
    let find = sel.indexOf(key);
    if (find > -1) {
      sel.splice(find, 1);
    } else {
      sel.push(key);
    }

    setState({
      selections: sel,
    });
  }

  return (
    <div className="flex flex-col px-4 py-4 rounded-lg shadow-lg lg:px-10 lg:py-10">
      <div className="relative flex flex-col font-bold font-custom1">
        <label className="flex flex-wrap mb-4 text-lg md:text-xl lg:text-2xl">
          <span className="mr-1 text-primary">Whats your </span>
          <span className="text-button"> name?</span>
        </label>

        <div className="flex items-center justify-between pb-1 mb-6">
          <input
            className="block w-full text-xl bg-transparent appearance-none cursor-pointer focus:outline-none placeholder-blue-grey-100 lg:text-2xl"
            ref={(node) => (name = node)}
            type="text"
            placeholder="Enter your name"
          />
        </div>

        <label className="flex flex-wrap mb-4 text-lg md:text-xl lg:text-2xl">
          <span className="mr-1 text-primary">Whats your </span>
          <span className="text-button"> company name?</span>
        </label>

        <div className="flex items-center justify-between pb-1 mb-6">
          <input
            className="block w-full text-xl bg-transparent appearance-none cursor-pointer focus:outline-none placeholder-blue-grey-100 lg:text-2xl"
            ref={(node) => (companyName = node)}
            type="text"
            placeholder="Enter your name"
          />
        </div>

        <label className="flex flex-wrap mb-4 text-lg md:text-xl lg:text-2xl">
          <span className="mr-1 text-primary">Whats your </span>
          <span className="text-button"> email?</span>
        </label>

        <div className="flex items-center justify-between pb-1 mb-6">
          <input
            className="block w-full text-xl bg-transparent appearance-none cursor-pointer focus:outline-none placeholder-blue-grey-100 lg:text-2xl"
            ref={(node) => (email = node)}
            type="email"
            placeholder="Enter your email"
          />
        </div>

        <label className="flex flex-wrap mb-4 text-lg md:text-xl lg:text-2xl">
          <span className="mr-1 text-primary">Who are </span>
          <span className="text-button"> you?</span>
        </label>
        {typeOfUser.map((item) => {
          return ((state.selections.includes('licensor') ||
            state.selections.includes('licensee')) &&
            item === 'agency') ||
            (state.selections.includes('agency') && item !== 'agency') ? (
            <label className="flex h-[32px] items-center justify-start mb-6" key={item}>
              <div className="ml-8 cursor-pointer px-4 font-bold font-custom1 text-xl lg:text-2xl text-inputGray">
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </div>
            </label>
          ) : (
            <label
              className={
                'flex items-center justify-start mb-6 text-xl lg:text-2xl'
              }
              key={item}
            >
              <input
                type="checkbox"
                value={item}
                checked={state.selections.includes(item)}
                onChange={() => handleCheckboxChange(item)}
                className={
                  'cursor-pointer hover:bg-inputGray text-sm md:text-base lg:text-lg !checkbox-smaller'
                }
              />
              <span
                className={
                  'px-4 font-bold font-custom1 text-primary text-xl lg:text-2xl'
                }
              >
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </span>
            </label>
          );
        })}

        {status === 'sending' && (
          <div className="my-6 text-base text-center text-button font-custom1 md:text-lg lg:text-xl">
            sending...
          </div>
        )}
        {status === 'error' && (
          <div className="my-2 text-base text-center text-redButton font-custom1 md:text-lg lg:text-xl">
            {message}
          </div>
        )}
        {status === 'success' && (
          <div className="my-2 text-base text-center text-green font-custom1 md:text-lg lg:text-xl">
            {message}
          </div>
        )}
        {error && (
          <div className="flex items-center justify-center h-4 mt-2 mb-4 text-sm text-red-400 font-custom2">
            {error}
          </div>
        )}
        <div className="flex items-center justify-center">
          <Button onClick={submit}>Join Waitlist</Button>
        </div>
      </div>
    </div>
  );
};
