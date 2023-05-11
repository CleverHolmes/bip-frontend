import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { NextRouter, useRouter } from 'next/router';

export const COOKIE_TOKEN = 'access_token';
export const COOKIE_REFRESH_TOKEN = 'refresh_token';
export const COOKIE_COMPANY_REPRESENTED = 'company_represented';
export const COOKIE_OPERATING_USER = 'operating_user';
export const COOKIE_PRIMARY_USER = 'primary_user';
export const COOKIE_CONSENT = 'CookieConsent';
import useStore from '../modules/Store';
import useStorage from 'hooks/useStorage';
import routes from 'constants/routes';

const cookieOptions = {
  path: '/',
  maxAge: 60 * 60 * 24 * 365,
};

function useAuth() {
  const { removeItem, getItem } = useStorage();
  const [storedToken, setStoredToken] = useState<string | undefined>();
  const [storedRefreshToken, setStoredRefreshToken] = useState<
    string | undefined
  >();
  const [cookies, setCookie, removeCookie] = useCookies([
    COOKIE_TOKEN,
    COOKIE_REFRESH_TOKEN,
    COOKIE_COMPANY_REPRESENTED,
    COOKIE_OPERATING_USER,
    COOKIE_PRIMARY_USER,
    COOKIE_CONSENT,
  ]);
  const router: NextRouter = useRouter();

  useEffect(() => {
    setStoredToken(cookies[COOKIE_TOKEN]);
    setStoredRefreshToken(cookies[COOKIE_REFRESH_TOKEN]);
  }, [cookies[COOKIE_TOKEN], cookies[COOKIE_REFRESH_TOKEN]]);

  const setTokens = (
    token: string | undefined,
    refreshToken?: string | undefined
  ) => {
    setStoredToken(token);
    setStoredRefreshToken(refreshToken);
    if (cookies[COOKIE_TOKEN] !== token) {
      if (token) {
        setCookie(COOKIE_TOKEN, token, cookieOptions);
      } else {
        removeCookie(COOKIE_TOKEN);
      }
    }

    if (cookies[COOKIE_REFRESH_TOKEN] !== refreshToken) {
      if (refreshToken) {
        setCookie(COOKIE_REFRESH_TOKEN, refreshToken, cookieOptions);
      } else {
        removeCookie(COOKIE_REFRESH_TOKEN);
        removeItem('company_represented');
        removeItem('primary_user');
        removeItem('operating_user');
        removeItem('access_token');
      }
    }
  };

  const removeTokens = () => setTokens(undefined, undefined);
  const reset = useStore.getState().reset;
  const logout = () => {
    removeTokens();
    removeCookie(COOKIE_COMPANY_REPRESENTED, { path: '/' });
    removeCookie(COOKIE_OPERATING_USER, { path: '/' });
    removeCookie(COOKIE_PRIMARY_USER, { path: '/' });
    removeCookie(COOKIE_TOKEN, { path: '/' });
    removeItem('company_represented');
    removeItem('primary_user');
    removeItem('operating_user');
    removeItem('access_token');
    reset();
    router.push(routes.home);
    window.location.reload();
  };

  const accessToken = getItem('access_token', 'session');

  return {
    token: storedToken ? storedToken : accessToken ? accessToken : null,
    refreshToken: storedRefreshToken,
    setTokens,
    removeTokens,
    logout,
    isLogged: !!storedToken || !!accessToken,
  };
}

export default useAuth;
