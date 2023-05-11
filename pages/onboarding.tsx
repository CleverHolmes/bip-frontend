import type { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { NextRouter, useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

import useStore from 'modules/Store';
import routes from 'constants/routes';
import { GSSPBasic } from 'utils/gsspBasic';
import OnboardingView from 'views/OnboardingView';
import useAuth from 'hooks/useAuth';

export const getServerSideProps: GetServerSideProps = GSSPBasic();

// create context for active step number and setActiveStepNumber
type StepperContextType = {
  activeStepNumber: number;
  activeStepProgress: number;
  setActiveStepNumber: React.Dispatch<React.SetStateAction<number>>;
  setActiveStepProgress: React.Dispatch<React.SetStateAction<number>>;
};

export const StepperContext = React.createContext<StepperContextType>({
  activeStepNumber: 0,
  activeStepProgress: 0,
  setActiveStepNumber: () => {},
  setActiveStepProgress: () => {},
});

const Onboarding: NextPage = () => {
  const router: NextRouter = useRouter();

  const { isLogged } = useAuth();

  // TODO: Persist the state of the form
  const [activeStepNumber, setActiveStepNumber] = useState<number>(0);
  const [activeStepProgress, setActiveStepProgress] = useState<number>(0);
  const newUser = useStore((state) => state.newUser);
  const userUUID = useStore((state) => state.userUUID);

  useEffect(() => {
    if (!newUser && !userUUID && !isLogged) {
      router.replace(routes.home);
    }
  }, [newUser, isLogged]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeStepNumber]);

  if (!newUser && !userUUID) return null;

  return (
    <>
      <Head>
        <title>BIP Onboarding</title>
      </Head>
      <StepperContext.Provider
        value={{
          activeStepNumber,
          setActiveStepNumber,
          activeStepProgress,
          setActiveStepProgress,
        }}
      >
        <OnboardingView />
      </StepperContext.Provider>
    </>
  );
};

export default Onboarding;
