import React from 'react';
import { useTranslation } from 'next-i18next';
import { useCookies } from 'react-cookie';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { NextRouter, useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';

import useStore from 'modules/Store';
import Accordion from 'components/Accordions/Accordion';
import Toast from 'components/Toast';
import { throwError } from 'utils/error';
import { delegate, delegateQueryKey } from 'api/delegate/delegate';
import OwnImage from 'components/Image';
import useStorage from 'hooks/useStorage';
import useTokensOrCookies from 'contexts/TokensOrCookies';
import { COOKIE_CONSENT } from 'hooks/useAuth';
import routes from 'constants/routes';
import { Delegate } from 'models/delegate/delegate';
import Button from 'components/Buttons/Button';

const AgentLicensors: React.FC = () => {
  const [cookies, setCookie] = useCookies([
    'company_represented',
    COOKIE_CONSENT,
  ]);
  const { setItem } = useStorage();
  const router: NextRouter = useRouter();

  const { handleSetCompanyRepresented } = useTokensOrCookies();

  const userUUID = useStore((state) => state.userUUID);
  const { t } = useTranslation();

  const { data: delegates } = useQuery({
    queryKey: [delegateQueryKey, userUUID],
    queryFn: async () => {
      return await delegate({
        params: { delegate_uuid: userUUID },
      });
    },
    enabled: !!userUUID,
    onError: (err) => {
      throwError(err);
    },
  });

  return (
    <>
      <div>
        <div className="text-xl font-bold font-custom1 lg:text-3xl text-primary flex justify-between items-center">
          {t('settings.licensors')}
          <Link href={routes.addLicensor}>
            <a>
              <Button smaller icon="Plus" />
            </a>
          </Link>
        </div>
        {delegates?.length === 0 && (
          <Link href="/add-client">
            <div className="mx-1 my-10 text-lg font-normal text-center underline cursor-pointer text-inputGray font-custom1 hover:text-button">
              {t('settings.add-licensor')}
            </div>
          </Link>
        )}
        {delegates && delegates.length > 0 && (
          <Accordion title={t('settings.list-of-clients')}>
            {delegates?.map((item: Delegate) => (
              <div
                className="flex items-center justify-start px-10 py-6 bg-white border-b-2 rounded-lg cursor-pointer border-borderColor hover:bg-button/10"
                key={item.uuid}
                onClick={() => {
                  handleSetCompanyRepresented(item.uuid);
                  if (cookies.CookieConsent === 'true') {
                    setCookie('company_represented', item.uuid, {
                      path: '/',
                      maxAge: 60 * 60 * 24 * 365,
                    });
                  } else {
                    setItem('company_represented', item.uuid, 'session');
                  }
                  toast(
                    <Toast
                      message={`${t(
                        'settings.you-are-now-acting-on-behalf-of'
                      )} ${item.company_name}`}
                    />
                  );
                  router.push(routes.settingsProfile);
                  useStore.setState({ actingAsNewUser: true });
                }}
              >
                <div className="flex items-center justify-center w-10 h-10 text-white shrink-0 sm:h-12 sm:w-12">
                  {!!item.company_logo.uri && (
                    <OwnImage
                      src={item.company_logo.uri}
                      alt="ProfileImage"
                      layout="fill"
                      width={48}
                      className="mx-auto rounded-xl"
                      classNameImage=" rounded-xl"
                    />
                  )}
                </div>
                <div className="ml-4">
                  <p className="mx-4 text-base cursor-pointer font-custom2">
                    {item.company_name}
                  </p>
                </div>
              </div>
            ))}
          </Accordion>
        )}
      </div>
    </>
  );
};

export default AgentLicensors;
