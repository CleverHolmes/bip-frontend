import Image from 'next/image';
import { NextRouter, useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';

import useStorage from 'hooks/useStorage';
import Button from 'components/new/Button';
import LoginModal from 'wrapper/components/LoginModal';
import SignUpModal from 'wrapper/components/SignUpModal';
import ForgotPasswordModal from 'wrapper/components/ForgotPasswordModal';
import useAuth from 'hooks/useAuth';
import routes from 'constants/routes';

const NavLanding = () => {
  const router: NextRouter = useRouter();

  const [isOpenLoginModal, setIsOpenLoginModal] = useState(false);
  const [isOpenSignUpModal, setIsOpenSignUpModal] = useState(false);
  const [isOpenForgotPasswordModal, setIsOpenForgotPasswordModal] =
    useState(false);

  const { t } = useTranslation();
  const { checkCookieEnabled } = useStorage();
  const { isLogged } = useAuth();

  const [header, setHeader] = useState('Logo');
  const [showCookieBanner, setShowCookieBanner] = useState(false);

  const listenScrollEvent = (event: any) => {
    if (window.scrollY < 1300) {
      setHeader('Logo');
    } else if (window.scrollY >= 1300) {
      setHeader('LogoPrimary');
    }
  };

  useEffect(() => {
    if (!checkCookieEnabled()) {
      setShowCookieBanner(true);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', listenScrollEvent);

    return () => window.removeEventListener('scroll', listenScrollEvent);
  }, []);

  return (
    <nav className="fixed top-0 left-0 z-10 w-full border-gray-200 bg-primary backdrop-filter backdrop-blur-lg bg-opacity-5">
      {showCookieBanner && (
        <div className="w-full py-2 text-sm text-center text-white uppercase md:text-lg bg-redButton font-custom1 font-bold">
          {t(
            'You have cookies disabled. Please enable them in your browser to successfully use the platform'
          )}
        </div>
      )}
      <div className="container flex justify-between py-5 pl-6 pr-6 mx-auto md:pr-0">
        <Image
          src={`/images/${header}.svg`}
          width={61}
          height={34}
          alt="BIP logo"
          onClick={() => router.push('/')}
          className="cursor-pointer fill-white"
        />
        {!showCookieBanner && (
          <div className="flex flex-col sm:flex-row mr-6 gap-6">
            <Button
              onClick={() => {
                if (!isLogged) setIsOpenLoginModal(true);
                else router.push(routes.explore);
              }}
            >
              Login
            </Button>
            <Button
              onClick={() => {
                if (!isLogged) setIsOpenSignUpModal(true);
                else router.push(routes.explore);
              }}
            >
              Sign Up
            </Button>
          </div>
        )}
      </div>
      <LoginModal
        isOpen={isOpenLoginModal}
        onClose={() => setIsOpenLoginModal(false)}
        onOpenSignUp={() => {
          setIsOpenLoginModal(false);
          setIsOpenSignUpModal(true);
        }}
        onOpenForgotPassword={() => {
          setIsOpenLoginModal(false);
          setIsOpenForgotPasswordModal(true);
        }}
      />
      <SignUpModal
        isOpen={isOpenSignUpModal}
        onClose={() => setIsOpenSignUpModal(false)}
        onOpenLogin={() => {
          setIsOpenSignUpModal(false);
          setIsOpenLoginModal(true);
        }}
      />
      <ForgotPasswordModal
        isOpen={isOpenForgotPasswordModal}
        onClose={() => setIsOpenForgotPasswordModal(false)}
        onOpenLogin={() => {
          setIsOpenForgotPasswordModal(false);
          setIsOpenLoginModal(true);
        }}
      />
    </nav>
  );
};

export default NavLanding;
