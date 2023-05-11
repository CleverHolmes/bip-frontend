/* eslint-disable prettier/prettier */
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import "react-loading-skeleton/dist/skeleton.css";
import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import "react-toastify/dist/ReactToastify.css";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import "react-loading-skeleton/dist/skeleton.css";
import "styles/globals.css";
import { appWithTranslation } from "next-i18next";
import { useCookies } from "react-cookie";
import Head from "next/head";
import { CookiesProvider } from "react-cookie";
import * as Sentry from "@sentry/nextjs";
import { ThemeProvider } from "@material-tailwind/react";
import type { AppProps } from "next/app";
import { ToastContainer } from "react-toastify";
import React, { useEffect, useState } from "react";
import { pdfjs } from "react-pdf";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useTranslation } from "next-i18next";
// @ts-ignore
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";
import { NextRouter, useRouter } from "next/router";

import ChatProvider from "modules/chat/chatProvider";
import AppWrapper from "wrapper/AppWrapper";
import { initGA } from "utils/initGA";
import { TokensOrCookiesProvider } from "contexts/TokensOrCookies";
import { COOKIE_CONSENT } from "hooks/useAuth";
import routes from "constants/routes";
import BannerBottom from "components/BannerBottom";
import CookieConsent from "components/new/CookieConsent";
import useStorage from "hooks/useStorage";

declare global {
  interface Window {
    ethereum: any;
  }
}

declare module "dayjs" {
  interface Dayjs {
    fromNow(withoutSuffix?: boolean): string;
  }
}

pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

if (process.env.NODE_ENV !== "development") {
  Sentry.init({
    dsn: "https://0fec3420640d4a49b94ff92518421c33@o4504181562146816.ingest.sentry.io/4504181810593792",
    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
  });
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: false,
      staleTime: 5 * 60 * 1000,
    },
  },
});

function MyApp({ Component, pageProps }: AppProps) {
  const { t } = useTranslation();
  const router: NextRouter = useRouter();
  const { checkCookieEnabled } = useStorage();

  const [cookies, setCookies, removeCookies] = useCookies([
    COOKIE_CONSENT,
    "_ga",
    "_gat",
    "_gid",
  ]);
  const [isCookiesConsentModalOpen, setIsCookiesConsentModalOpen] = useState(
    cookies.CookieConsent === undefined ? true : false
  );
  const [showCookieConsentBanner, setShowCookieConsentBanner] = useState(true);

  const isUnprotected =
    router.pathname === routes.home || router.pathname === routes.onboarding;

  const handleAcceptCookie = () => {
    if (process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID) {
      initGA(process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID);
    }
  };

  function closeCookiesConsentModal() {
    setIsCookiesConsentModalOpen(false);
  }

  useEffect(() => {
    if (!checkCookieEnabled() || router.pathname === routes.subscribe) {
      setShowCookieConsentBanner(false);
    }
  }, []);

  useEffect(() => {
    const isConsent = cookies.CookieConsent === "true";
    if (isConsent) {
      handleAcceptCookie();
    }
  }, []);

  return (
    <>
      <Head>
        <title>BIP</title>
        {
          // <link rel='shortcut icon' href='./favicon.ico' />
          // Favicon was causing issue with css loading from Chat Scope
        }
        {/* <link rel='shortcut icon' href='/images/favicon.ico' />
        <link
          rel='apple-touch-icon'
          sizes='180x180'
          href='/images/apple-touch-icon.png'
        />
        <link
          rel='icon'
          type='image/png'
          sizes='32x32'\
          href='/images/favicon-32x32.png'
        />
        <link
          rel='icon'
          type='image/png'
          sizes='16x16'
          href='/images/favicon-16x16.png'
        /> */}
      </Head>
      {/* Add the favicon */}
      {/* Note that the path doesn't include "public" */}
      {/* <Sentry.ErrorBoundary fallback={<p>An error has occurred</p>}> */}
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <CookiesProvider>
            <TokensOrCookiesProvider>
              {isUnprotected && <Component {...pageProps} />}
              {!isUnprotected && (
                <AppWrapper>
                  <ChatProvider>
                    <Component {...pageProps} />
                  </ChatProvider>
                </AppWrapper>
              )}
              <ToastContainer
                position="top-center"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                toastClassName={() =>
                  "text-grayN100 font-bodyText text-base bg-white relative flex py-2 mb-2 pr-2 pl-3 min-h-20 w-96 rounded-lg shadow-lg justify-between overflow-hidden cursor-pointer"
                }
                progressClassName="toast-custom-progress-bar"
              />
              {false &&
                showCookieConsentBanner &&
                cookies.CookieConsent !== "true" && (
                  <BannerBottom
                    isOpen={isCookiesConsentModalOpen}
                    closeModal={closeCookiesConsentModal}
                    closable={false}
                  >
                    <div className="mt-10 mb-10 md:mt-5">
                      <CookieConsent closeModal={closeCookiesConsentModal} />
                    </div>
                  </BannerBottom>
                )}
            </TokensOrCookiesProvider>
          </CookiesProvider>
        </ThemeProvider>
        {/* </Sentry.ErrorBoundary> */}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </>
  );
}

export default appWithTranslation(MyApp);
