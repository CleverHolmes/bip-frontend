import { useCookies } from 'react-cookie';
import { useState, createContext, useContext } from 'react';

import useStorage from 'hooks/useStorage';

interface TokensOrCookiesContextProps {
  accessToken: string | null;
  companyRepresented: string | null;
  operatingUser: string | null;
  primaryUser: string | null;
  handleSetCompanyRepresented: (name: string) => void;
  handleSetAccessToken: (name: string) => void;
  handleSetOperatingUser: (name: string) => void;
  handleSetPrimaryUser: (name: string) => void;
}

const TokensOrCookiesContext = createContext<TokensOrCookiesContextProps>({
  accessToken: null,
  companyRepresented: null,
  operatingUser: null,
  primaryUser: null,
  // eslint-disable-next-line no-empty-function
  handleSetCompanyRepresented: () => {},
  // eslint-disable-next-line no-empty-function
  handleSetAccessToken: () => {},
  // eslint-disable-next-line no-empty-function
  handleSetOperatingUser: () => {},
  // eslint-disable-next-line no-empty-function
  handleSetPrimaryUser: () => {},
});

const TokensOrCookiesProvider = (props: any) => {
  const [cookies] = useCookies([
    'access_token',
    'operating_user',
    'primary_user',
    'company_represented',
  ]);

  const { getItem } = useStorage();
  const access = getItem('access_token', 'session');
  const operating = getItem('operating_user', 'session');
  const primary = getItem('primary_user', 'session');
  const company = getItem('company_represented', 'session');

  const [accessToken, setAccessToken] = useState(
    cookies.access_token ? cookies.access_token : access ? access : null
  );

  const handleSetAccessToken = (name: string) => {
    setAccessToken(name);
  };

  const [operatingUser, setOperatingUser] = useState(
    cookies.operating_user
      ? cookies.operating_user
      : operating
      ? operating
      : null
  );

  const handleSetOperatingUser = (name: string) => {
    setOperatingUser(name);
  };

  const [primaryUser, setPrimaryUser] = useState<string>(
    cookies.primary_user ? cookies.primary_user : primary ? primary : null
  );

  const handleSetPrimaryUser = (name: string) => {
    setPrimaryUser(name);
  };

  const [companyRepresented, setCompanyRepresented] = useState(
    cookies.company_represented
      ? cookies.company_represented
      : company
      ? company
      : null
  );

  const handleSetCompanyRepresented = (name: string) => {
    setCompanyRepresented(name);
  };

  const contextValue = {
    accessToken,
    companyRepresented,
    handleSetCompanyRepresented,
    handleSetAccessToken,
    handleSetOperatingUser,
    handleSetPrimaryUser,
    operatingUser,
    primaryUser,
  };

  return (
    <TokensOrCookiesContext.Provider value={contextValue}>
      {props.children}
    </TokensOrCookiesContext.Provider>
  );
};

const useTokensOrCookies = (): TokensOrCookiesContextProps => {
  const context = useContext(TokensOrCookiesContext);
  if (!context) {
    throw new Error(
      'useTokensOrCookies must be used within a TokensOrCookiesProvider'
    );
  }
  return context;
};

export { TokensOrCookiesProvider, useTokensOrCookies, TokensOrCookiesContext };

export default useTokensOrCookies;
