import Image from 'next/image';
import { NextRouter, useRouter } from 'next/router';
import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import Accordion from 'components/Accordions/Accordion';
import BoxField from 'components/BoxFields/BoxField';
import BoxFieldCategories from 'components/BoxFields/BoxFieldCategories';
import Button from 'components/Buttons/Button';
import HeaderTextButton from 'components/Buttons/HeaderTextButton';
import { Modal, ModalContents, ModalOpenButton } from 'components/ModalWindow';
import ActiveLicensees from 'components/Modals/ActiveLicensees';
import AgencyName from 'components/Modals/AgencyName';
import BrandsRepresented from 'components/Modals/BrandsRepresented';
import BusinessYears from 'components/Modals/BusinessYears';
import CompanyName from 'components/Modals/CompanyName';
import Name from 'components/Modals/Name';
import ProductCategories from 'components/Modals/ProductCategories';
import Territories from 'components/Modals/Territories';
import {
  activeLicenseesChoices,
  wholesaleVolumeChoices,
} from 'public/helpers/data';
import useStore from 'modules/Store';
import CircleLoaderSpinner from 'components/CircleLoaderSpinner';
import CheckboxNoRegister from 'components/CheckboxNoRegister';
import useTokensOrCookies from 'contexts/TokensOrCookies';
import { UserPostRequest, UserRoles } from 'models/user/user';
import routes from 'constants/routes';
import { postUser } from 'api/user/postUser';
import { patchUser } from 'api/user/patchUser';
import useAuth from 'hooks/useAuth';
import useStorage from 'hooks/useStorage';
import { ErrorType } from 'public/axios';

const ReviewAndConfirm = ({
  isSubmitting,
  setIsSubmitting,
}: {
  setIsSubmitting: (isSubmit: boolean) => void;
  isSubmitting: boolean;
}) => {
  const state = useStore();
  const { t } = useTranslation();
  const { handleSetAccessToken } = useTokensOrCookies();
  const [patchError, setPatchError] = useState('');
  const [termsError, setTermsError] = useState('');
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const { setItem } = useStorage();
  const { setTokens } = useAuth();

  const newUser = useStore((state) => state.newUser);
  const updateNewUser = useStore((state) => state.updateNewUser);
  const userUUID = useStore((state) => state.userUUID);

  const router: NextRouter = useRouter();

  const { mutate: createUser } = useMutation(
    async (data: UserPostRequest) => {
      return await postUser(data);
    },
    {
      onSuccess: (res) => {
        useStore.setState({ logIn: true });
        handleSetAccessToken(res.token);
        if (newUser?.stayLoggedIn) {
          setTokens(res.token);
        } else {
          setItem('access_token', res.token, 'session');
        }
        updateNewUser();
        router.replace(routes.explore);
      },
      onError: (err: AxiosError<any, ErrorType>) => {
        setPatchError(err?.response?.data.message);
        setIsSubmitting(false);
        setIsDisabled(false);
      },
    }
  );

  const { mutate: updateUser } = useMutation(
    async (data: UserPostRequest) => {
      return await patchUser(data);
    },
    {
      onSuccess: () => {
        router.replace(routes.explore);
      },
      onError: (err: AxiosError<any, ErrorType>) => {
        setPatchError(err?.response?.data.message);
        setIsSubmitting(false);
        setIsDisabled(false);
      },
    }
  );

  const submit = async () => {
    if (!stateCheckBoxTerms) {
      setTermsError('*You must agree to the terms in order to continue.');
      return;
    } else if (!state.company_name) {
      setPatchError(`*${t('errors:company-name-is-required')}`);
      return;
    }
    setIsDisabled(true);
    const wholeSaleSelection = wholesaleVolumeChoices.filter(
      (item) => item.value === state.annual_wholesale_volume
    )[0];
    const licenseeSelection = activeLicenseesChoices.filter(
      (item) => item.value === state.active_licensees
    )[0];

    setIsSubmitting(true);
    setTermsError('');
    setPatchError('');

    const user: UserPostRequest = {
      email: newUser?.email,
      password: newUser?.password,
      roles: state.roles,
      name_first: state.name_first === '' ? undefined : state.name_first,
      name_last: state.name_last === '' ? undefined : state.name_last,
      company_name: !state.company_name ? undefined : state.company_name,
      payment_reminder_days_ahead: [1, 5, 15],
      business_years:
        state.business_years === null ? undefined : state.business_years,
      territories:
        state.territories.length === 0 ? undefined : state.territories,
      brands_represented:
        state.brands_represented.length === 0
          ? undefined
          : state.brands_represented,
      categories: !state.categories ? undefined : state.categories,
      categories_licensee: !state.categories_licensee
        ? undefined
        : state.categories_licensee,
      categories_licensee_core: !state.categories_licensee_core
        ? undefined
        : state.categories_licensee_core,
      active_licensees: licenseeSelection
        ? [licenseeSelection.min, licenseeSelection.max]
        : undefined,
      current_licenses:
        state.current_licenses.length === 0
          ? undefined
          : state.current_licenses,
      top_5_customers:
        state.top_5_customers.length === 0 ? undefined : state.top_5_customers,
      annual_wholesale_volume: wholeSaleSelection
        ? [wholeSaleSelection.min, wholeSaleSelection.max]
        : undefined,
      publicly_visible: [
        'about',
        'active_licensees',
        'territories',
        'top_5_customers',
        'annual_wholesale_volume',
        'current_licenses',
        'business_years',
      ],
    };

    if (user.password && user.email && !userUUID) {
      createUser(user);
    } else {
      user.user_uuid = userUUID;
      updateUser(user);
    }
  };

  const [stateCheckBoxTerms, setStateCheckBoxTerms] = useState<boolean>(false);

  const handleCheckboxChangeTerms = () => {
    setStateCheckBoxTerms(!stateCheckBoxTerms);
  };

  const roles = useStore((state) => state.roles);

  return (
    <>
      {!isSubmitting ? (
        <div className="flex flex-col mx-4 sm:mx-6 lg:container lg:mx-auto">
          <div className="mb-2 text-xl font-bold font-custom1 md:text-2xl lg:text-5xl">
            <span className="text-primary">{t('onboarding.review')} </span>
            <span className="text-button">{t('onboarding.and-confirm')}</span>
          </div>
          <div className="text-inputGray font-custom2 md:mb-10 lg:mb-20">
            {t('onboarding.click-on-info')}
          </div>

          <Accordion title={t('onboarding.personal-details-capitalized')}>
            <Modal>
              <ModalOpenButton>
                <BoxField
                  title={t('onboarding.name-capitalized')}
                  description={`${state.name_first} ${state.name_last}`}
                />
              </ModalOpenButton>
              <ModalContents pencil>
                <Name
                  defaultValue1={state.name_first}
                  defaultValue2={state.name_last}
                />
              </ModalContents>
            </Modal>
          </Accordion>
          <Accordion title={t('onboarding.company-info-capitalized')}>
            <Modal>
              <ModalOpenButton>
                <BoxField
                  title={t('onboarding.territories-capitalized')}
                  description={state.territories}
                />
              </ModalOpenButton>
              <ModalContents pencil>
                <Territories defaultValue={state.territories} />
              </ModalContents>
            </Modal>
            {(state.roles.includes(UserRoles.LICENSEE) ||
              state.roles.includes(UserRoles.LICENSOR)) && (
              <Modal>
                <ModalOpenButton>
                  <BoxField
                    title={t('onboarding.company-name-capitalized')}
                    description={`${state.company_name}`}
                  />
                </ModalOpenButton>
                <ModalContents pencil>
                  <CompanyName defaultValue={state.company_name} />
                </ModalContents>
              </Modal>
            )}
            {state.roles.includes(UserRoles.AGENCY) && (
              <Modal>
                <ModalOpenButton>
                  <BoxField
                    title={t('onboarding.agency-name-capitalized')}
                    description={`${state.company_name}`}
                  />
                </ModalOpenButton>
                <ModalContents pencil>
                  <AgencyName defaultValue={state.company_name} />
                </ModalContents>
              </Modal>
            )}
            {state.roles.includes(UserRoles.LICENSEE) && (
              <Modal>
                <ModalOpenButton>
                  <BoxField
                    title={t('onboarding.number-of-years-in-business')}
                    description={`${state.business_years} years`}
                  />
                </ModalOpenButton>
                <ModalContents pencil>
                  <BusinessYears defaultValue={state.business_years} />
                </ModalContents>
              </Modal>
            )}
            {state.roles.includes(UserRoles.AGENCY) && (
              <Modal>
                <ModalOpenButton>
                  <BoxField
                    title={t('onboarding.current-brands-capitalized')}
                    description={`${Object.keys(state.brands_represented)
                      .map((k: any) => state.brands_represented[k])
                      .join(', ')}`}
                  />
                </ModalOpenButton>
                <ModalContents pencil>
                  <BrandsRepresented defaultValue={state.brands_represented} />
                </ModalContents>
              </Modal>
            )}
            {state.roles.includes(UserRoles.LICENSOR) && (
              <Modal>
                <ModalOpenButton>
                  <BoxFieldCategories
                    title={t(
                      'onboarding.product-categories-licensor-capitalized'
                    )}
                    description={state.categories}
                  />
                </ModalOpenButton>
                <ModalContents pencil>
                  <ProductCategories defaultValue={state.categories} />
                </ModalContents>
              </Modal>
            )}
            {state.roles.includes(UserRoles.LICENSEE) && (
              <Modal>
                <ModalOpenButton>
                  <BoxFieldCategories
                    title={t(
                      'onboarding.product-categories-licensee-capitalized'
                    )}
                    description={state.categories_licensee}
                    emphasis={state.categories_licensee_core}
                  />
                </ModalOpenButton>
                <ModalContents pencil>
                  <ProductCategories
                    isLicensee={true}
                    defaultValue={state.categories_licensee}
                    defaultValueCore={state.categories_licensee_core}
                  />
                </ModalContents>
              </Modal>
            )}
            {state.roles.includes(UserRoles.LICENSOR) && (
              <Modal>
                <ModalOpenButton>
                  <BoxField
                    title={t('onboarding.active-licensees-capitalized')}
                    description={state.active_licensees}
                  />
                </ModalOpenButton>
                <ModalContents pencil>
                  <ActiveLicensees
                    defaultValue={state.active_licensees.toString()}
                  />
                </ModalContents>
              </Modal>
            )}
          </Accordion>

          <div className="mx-auto my-6">
            <div className="h-4 mb-3 ml-4 text-sm text-red-400 font-custom2">
              {termsError}
            </div>
            <CheckboxNoRegister
              label={t('onboarding.terms-label')}
              label2={
                roles.includes(UserRoles.LICENSOR) ||
                roles.includes(UserRoles.AGENCY)
                  ? t('onboarding.licensor-terms')
                  : t('onboarding.licensee-terms')
              }
              label3={
                roles.includes(UserRoles.LICENSOR) &&
                roles.includes(UserRoles.LICENSEE)
                  ? t('onboarding.licensee-terms')
                  : ``
              }
              link={
                roles.includes(UserRoles.LICENSOR) ||
                roles.includes(UserRoles.AGENCY)
                  ? routes.licensorTerms
                  : routes.licenseeTerms
              }
              link2={
                roles.includes(UserRoles.LICENSOR) &&
                roles.includes(UserRoles.LICENSEE)
                  ? routes.licenseeTerms
                  : ''
              }
              name="acceptTerms"
              onChange={handleCheckboxChangeTerms}
              selections={stateCheckBoxTerms ? ['acceptTerms'] : []}
            />
          </div>

          <div className="flex flex-col items-center justify-center mb-16">
            <div className="h-4 mb-3 ml-4 text-sm text-red-400 font-custom2">
              {patchError}
            </div>
            <Button disabled={isDisabled} onClick={submit}>
              {t('onboarding.review-submit')}
            </Button>
          </div>

          <div className="relative px-4 py-24 mb-20 rounded-lg rounded-l bg-gradientHome sm:px-6 md:px-10 xl:px-0">
            <HeaderTextButton
              header={t('onboarding.session-header')}
              text={t('onboarding.session-text')}
              button={t('onboarding.session-button')}
              color="primary"
              center={true}
              onClick={() =>
                window.open(
                  'https://calendly.com/kyle-blumberg/1-1-bip-market-help',
                  '_blank'
                )
              }
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
          </div>
        </div>
      ) : (
        <CircleLoaderSpinner size={500} />
      )}
    </>
  );
};

export default ReviewAndConfirm;
