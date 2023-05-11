import Cookies from 'universal-cookie';

import { initGA } from 'utils/initGA';

export const getCookieConsent = () => {
  const cookies = new Cookies();
  const isConsent = cookies.get('CookieConsent');
  if (isConsent) {
    cookies.set('CookieConsent', true, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
    });
    if (process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID) {
      initGA(process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID);
    }
  }
};
