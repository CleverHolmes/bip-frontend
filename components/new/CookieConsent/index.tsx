import React from 'react';
import { useTranslation } from 'next-i18next';
import { useCookies } from 'react-cookie';

import Button from 'components/Buttons/Button';
import { initGA } from 'utils/initGA';
import { COOKIE_CONSENT } from 'hooks/useAuth';

type Props = {
  closeModal: () => void;
};

const cookieOptions = {
  path: '/',
  maxAge: 60 * 60 * 24 * 365,
};

const CookieConsent: React.FC<Props> = ({ closeModal }) => {
  const { t } = useTranslation();
  const [cookies, setCookie, removeCookie] = useCookies([
    COOKIE_CONSENT,
    '_ga',
    '_gat',
    '_gid',
  ]);
  const handleAcceptCookie = () => {
    setCookie(COOKIE_CONSENT, true, cookieOptions);
    if (process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID) {
      initGA(process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID);
    }
    closeModal();
  };

  const handleDeclineCookie = () => {
    //remove google analytics cookies
    setCookie(COOKIE_CONSENT, false, cookieOptions);
    removeCookie('_ga');
    removeCookie('_gat');
    removeCookie('_gid');
    closeModal();
  };

  return (
    <div className="flex flex-col md:flex-row">
      <div className="mx-4 mb-4 text-lg text-center md:text-left font-custom1 text-primary lg:mb-0">
        {t('cookie-terms')}
      </div>
      <div className="flex flex-col items-center mx-10 mt-10 md:mt-0 md:mx-0 md:ml-10">
        <Button onClick={handleAcceptCookie} className="mt-4 md:mt-0">
          {t('i-understand')}
        </Button>
        <Button
          onClick={handleDeclineCookie}
          className="mt-4"
          color="yellow"
        >
          {t('i-decline')}
        </Button>
      </div>
    </div>
  );
};

export default CookieConsent;
