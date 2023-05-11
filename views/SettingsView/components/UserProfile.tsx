import React from 'react';
import { useTranslation } from 'next-i18next';
import { useMount } from 'react-use';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';

import useStore from 'modules/Store';
import Accordion from 'components/Accordions/Accordion';
import { Modal, ModalContents, ModalOpenButton } from 'components/ModalWindow';
import BoxField from 'components/BoxFields/BoxField';
import PaymentReminderDays from 'components/Modals/PaymentReminderDays';
import DealRequests from 'components/Modals/DealRequests';
import Name from 'components/Modals/Name';
import CompanyLogoFileUpload from 'components/CompanyLogoFileUpload';
import Territories from 'components/Modals/Territories';
import BoxFieldCategories from 'components/BoxFields/BoxFieldCategories';
import ProductCategories from 'components/Modals/ProductCategories';
import CompanyName from 'components/Modals/CompanyName';
import AgencyName from 'components/Modals/AgencyName';
import BusinessYears from 'components/Modals/BusinessYears';
import BrandsRepresented from 'components/Modals/BrandsRepresented';
import CurrentLicenses from 'components/Modals/CurrentLicenses';
import Top5Customers from 'components/Modals/Top5Customers';
import {
  activeLicenseesChoices,
  wholesaleVolumeChoices,
} from 'public/helpers/data';
import ActiveLicensees from 'components/Modals/ActiveLicensees';
import WholesaleVolume from 'components/Modals/WholesaleVolume';
import UserChannels from 'components/Modals/UserChannels';
import About from 'components/Modals/About';
import useTokensOrCookies from 'contexts/TokensOrCookies';
import { getUserCall, getUserQueryKey } from 'api/user/getUserCall';
import { getCurrentUuid } from 'utils/getCurrentUuid';
import { throwError } from 'utils/error';
import usePlans from 'wrapper/components/PlansModal/usePlans';
import VerifiedMark from 'components/new/VerifiedMark';
import { AccountFlags, UserRoles } from 'models/user/user';

const UserProfile: React.FC = () => {
  const updatePlansModalOpen = useStore((state) => state.updatePlansModalOpen);
  const { companyRepresented, operatingUser, primaryUser } =
    useTokensOrCookies();
  const { t } = useTranslation();
  const currentUuid = getCurrentUuid();
  const { showPaymentPlans } = usePlans();

  const tourActive = useStore((state) => state.tourActive);

  const queryClient = useQueryClient();
  const { data: userData } = useQuery({
    queryKey: [getUserQueryKey, currentUuid],
    queryFn: async () => {
      return await getUserCall(currentUuid);
    },
    enabled: !!currentUuid,
    onSuccess: () => {
      useStore.setState({ actingAsNewUser: false });
    },
  });
  const { data: userDataOperatingUser } = useQuery({
    queryKey: [getUserQueryKey, operatingUser],
    queryFn: async () => {
      if (!operatingUser) return;
      return await getUserCall(operatingUser);
    },
    enabled: !!operatingUser,
    onError: (err) => {
      throwError(err);
    },
  });
  const showDealRequests = userData?.roles?.includes(UserRoles.LICENSOR);

  const firstName =
    userDataOperatingUser?.name_first || userData?.name_first || '';
  const lastName =
    userDataOperatingUser?.name_last || userData?.name_last || '';
  const email = userDataOperatingUser?.email || userData?.email || '';

  const hasOnlyVerifiedFlag =
    userDataOperatingUser?.account_flags?.includes(
      AccountFlags.DEAL_MAKING_PERMITTED_BY_VERIFIED_USERS_ONLY
    ) ||
    userData?.account_flags?.includes(
      AccountFlags.DEAL_MAKING_PERMITTED_BY_VERIFIED_USERS_ONLY
    );

  const handleShowPlansModal = () => {
    updatePlansModalOpen(true);
  };

  useMount(() => {
    if (tourActive) {
      setTimeout(() => {
        useStore.setState({ run: true });
      }, 1200);
    }
  });

  const refreshUser = () => {
    queryClient.invalidateQueries({
      queryKey: [getUserQueryKey, currentUuid],
    });
  };

  const refreshUserOperating = () => {
    queryClient.invalidateQueries({
      queryKey: [getUserQueryKey, operatingUser],
    });
  };

  return (
    <>
      {userData && userData.roles && (
        <div>
          <div className="relative flex items-center gap-4">
            <div className="text-xl font-bold font-custom1 lg:text-3xl text-primary">
              {t('settings.profile')}
            </div>

            <Link href={`/company/${currentUuid}`}>
              <a
                className={
                  'font-normal underline rounded-full flex justify-center items-center text-base text-inputGray hover:text-button cursor-pointer '
                }
              >
                {t('settings.view-your-page')}
              </a>
            </Link>
            <VerifiedMark show={userData.verified_user} />
          </div>
          {/* {(!!userData.roles.includes('licensor') ||
            !!userData.roles.includes('agency')) && (
            <Accordion title="Vetting Module">
              <Modal>
                <ModalOpenButton>
                  <div id="verifyProperties">
                    <BoxField
                      title="Verify Properties"
                      description="Submit your properties"
                    />
                  </div>
                </ModalOpenButton>
                <ModalContents pencil>
                  <UploadProperty refreshUser={refreshUser} />
                </ModalContents>
              </Modal>
            </Accordion>
          )} */}
          {userData && (
            <Accordion title={t('reminders')}>
              <Modal>
                <ModalOpenButton>
                  <BoxField
                    title={t('settings.payment-reminder-days')}
                    description={userData.payment_reminder_days_ahead.sort(
                      (a: number, b: number) => {
                        return a - b;
                      }
                    )}
                  />
                </ModalOpenButton>
                <ModalContents pencil>
                  <PaymentReminderDays
                    defaultValue={userData.payment_reminder_days_ahead}
                    refreshUser={refreshUser}
                  />
                </ModalContents>
              </Modal>
            </Accordion>
          )}
          {showPaymentPlans && (
            <Accordion title={t('payment-plan')}>
              <BoxField
                description={
                  userData.plan
                    ? t(`plans-selection.${userData.plan}`)
                    : t('select-your-payment-plan')
                }
                onClick={handleShowPlansModal}
              />
            </Accordion>
          )}
          {showDealRequests && (
            <div id="dealRequests">
              <Accordion title={t('settings.deal-requests')}>
                <Modal>
                  <ModalOpenButton>
                    <BoxField
                      title={t('settings.deal-requests-select')}
                      description={
                        hasOnlyVerifiedFlag
                          ? t('settings.deal-requests-select-only-verified')
                          : t('settings.deal-requests-select-anyone-can-send')
                      }
                    />
                  </ModalOpenButton>
                  <ModalContents pencil>
                    <DealRequests
                      defaultValue={hasOnlyVerifiedFlag}
                      refreshUser={refreshUser}
                    />
                  </ModalContents>
                </Modal>
              </Accordion>
            </div>
          )}
          <div id="editProfile">
            <Accordion title={t('settings.personal-details')}>
              {(firstName || lastName) && (
                <Modal>
                  <ModalOpenButton>
                    <BoxField
                      title={t('name')}
                      description={
                        operatingUser && companyRepresented === primaryUser
                          ? userDataOperatingUser?.name_first ||
                            userDataOperatingUser?.name_last
                            ? `${userDataOperatingUser?.name_first} ${userDataOperatingUser?.name_last}`
                            : t('please-enter-information')
                          : userData.name_first || userData.name_last
                          ? `${userData.name_first} ${userData.name_last}`
                          : t('please-enter-information')
                      }
                    />
                  </ModalOpenButton>
                  <ModalContents pencil>
                    <Name
                      defaultValue1={firstName}
                      defaultValue2={lastName}
                      refreshUser={
                        operatingUser && companyRepresented === primaryUser
                          ? refreshUserOperating
                          : refreshUser
                      }
                      profile={true}
                    />
                  </ModalContents>
                </Modal>
              )}
              {email && (
                <BoxField
                  uppercase
                  title={t('settings.email')}
                  description={email}
                  noEdit
                />
              )}
              <BoxField
                uppercase
                title={t('roles')}
                description={userData.roles}
                noEdit
              />
            </Accordion>
          </div>
          <Accordion title={t('company-logo-title')}>
            <Modal>
              <ModalOpenButton>
                <BoxField
                  title={t('company-logo-title')}
                  description={t('upload-a-new-logo')}
                />
              </ModalOpenButton>
              <ModalContents pencil>
                <CompanyLogoFileUpload refreshUser={refreshUser} />
              </ModalContents>
            </Modal>
          </Accordion>
          <Accordion title={t('company-info')}>
            {(userData.roles.includes('licensee') ||
              userData.roles.includes('licensor')) && (
              <Modal>
                <ModalOpenButton>
                  <BoxField
                    title={t('company-name')}
                    description={
                      userData?.company_name
                        ? `${userData.company_name}`
                        : t('please-enter-information')
                    }
                  />
                </ModalOpenButton>
                <ModalContents pencil>
                  <CompanyName
                    defaultValue={userData.company_name}
                    refreshUser={refreshUser}
                    profile={true}
                  />
                </ModalContents>
              </Modal>
            )}
            <Modal>
              <ModalOpenButton>
                <BoxField
                  title={t('territories')}
                  description={
                    userData.territories.length > 0
                      ? userData.territories
                      : t('please-enter-information')
                  }
                  visible={userData.publicly_visible.includes('territories')}
                  notVisible={
                    !userData.publicly_visible.includes('territories')
                  }
                />
              </ModalOpenButton>
              <ModalContents pencil>
                <Territories
                  defaultValue={userData.territories}
                  refreshUser={refreshUser}
                  profile={true}
                  defaultValueToggle={userData.publicly_visible}
                  visibilityToggle={true}
                />
              </ModalContents>
            </Modal>
            {userData.roles.includes('licensor') && (
              <Modal>
                <ModalOpenButton>
                  <BoxFieldCategories
                    title={t('product-categories-licensor')}
                    description={userData.categories}
                  />
                </ModalOpenButton>
                <ModalContents pencil>
                  <ProductCategories
                    defaultValue={userData.categories}
                    profile={true}
                    refreshUser={refreshUser}
                  />
                </ModalContents>
              </Modal>
            )}
            {userData.roles.includes('licensee') && (
              <Modal>
                <ModalOpenButton>
                  <BoxFieldCategories
                    title={t('product-categories-licensee')}
                    description={userData.categories_licensee}
                    emphasis={userData.categories_licensee_core}
                  />
                </ModalOpenButton>
                <ModalContents pencil>
                  <ProductCategories
                    defaultValue={userData.categories_licensee}
                    defaultValueCore={userData.categories_licensee_core}
                    profile={true}
                    refreshUser={refreshUser}
                    isLicensee={true}
                  />
                </ModalContents>
              </Modal>
            )}
            {userData.roles.includes('agency') && (
              <Modal>
                <ModalOpenButton>
                  <BoxField
                    title={t('agency-name')}
                    description={
                      userData.company_name
                        ? `${userData.company_name}`
                        : t('please-enter-information')
                    }
                  />
                </ModalOpenButton>
                <ModalContents pencil>
                  <AgencyName
                    defaultValue={userData.company_name}
                    refreshUser={refreshUser}
                    profile={true}
                  />
                </ModalContents>
              </Modal>
            )}
            {userData.roles.includes('licensee') && (
              <Modal>
                <ModalOpenButton>
                  <BoxField
                    title={t('number-of-years-in-business')}
                    description={
                      userData.business_years
                        ? `${userData.business_years} years`
                        : t('please-enter-information')
                    }
                    visible={userData.publicly_visible.includes(
                      'business_years'
                    )}
                    notVisible={
                      !userData.publicly_visible.includes('business_years')
                    }
                  />
                </ModalOpenButton>
                <ModalContents pencil>
                  <BusinessYears
                    defaultValue={userData.business_years}
                    refreshUser={refreshUser}
                    profile={true}
                    defaultValueToggle={userData.publicly_visible}
                    visibilityToggle={true}
                  />
                </ModalContents>
              </Modal>
            )}

            {userData.roles.includes('agency') && (
              <Modal>
                <ModalOpenButton>
                  <BoxField
                    title={t('five-current-brands')}
                    description={
                      userData.brands_represented.length > 0
                        ? `${Object.keys(userData.brands_represented)
                            .map((k: any) => userData.brands_represented[k])
                            .join(', ')}`
                        : t('please-enter-information')
                    }
                    visible={userData.publicly_visible.includes(
                      'brands_represented'
                    )}
                    notVisible={
                      !userData.publicly_visible.includes('brands_represented')
                    }
                  />
                </ModalOpenButton>
                <ModalContents pencil>
                  <BrandsRepresented
                    defaultValue={userData.brands_represented}
                    refreshUser={refreshUser}
                    profile={true}
                    defaultValueToggle={userData.publicly_visible}
                    visibilityToggle={true}
                  />
                </ModalContents>
              </Modal>
            )}

            {userData.roles.includes('licensee') && (
              <Modal>
                <ModalOpenButton>
                  <BoxField
                    title={t('five-current-licenses')}
                    description={
                      userData.current_licenses
                        ? `${Object.keys(userData.current_licenses)
                            .map((k: any) => userData.current_licenses[k])
                            .join(', ')}`
                        : t('please-enter-information')
                    }
                    visible={userData.publicly_visible.includes(
                      'current_licenses'
                    )}
                    notVisible={
                      !userData.publicly_visible.includes('current_licenses')
                    }
                  />
                </ModalOpenButton>
                <ModalContents pencil>
                  <CurrentLicenses
                    defaultValue={userData.current_licenses}
                    refreshUser={refreshUser}
                    profile={true}
                    defaultValueToggle={userData.publicly_visible}
                    visibilityToggle={true}
                  />
                </ModalContents>
              </Modal>
            )}
            {userData.roles.includes('licensee') && (
              <Modal>
                <ModalOpenButton>
                  <BoxField
                    title={t('top-customers')}
                    description={
                      userData.top_5_customers.length > 0
                        ? `${Object.keys(userData.top_5_customers)
                            .map((k: any) => userData.top_5_customers[k])
                            .join(', ')}`
                        : t('please-enter-information')
                    }
                    visible={userData.publicly_visible.includes(
                      'top_5_customers'
                    )}
                    notVisible={
                      !userData.publicly_visible.includes('top_5_customers')
                    }
                  />
                </ModalOpenButton>
                <ModalContents pencil>
                  <Top5Customers
                    defaultValue={userData.top_5_customers}
                    refreshUser={refreshUser}
                    profile={true}
                    defaultValueToggle={userData.publicly_visible}
                    visibilityToggle={true}
                  />
                </ModalContents>
              </Modal>
            )}
            {userData.roles.includes('licensor') && (
              <Modal>
                <ModalOpenButton>
                  <BoxField
                    title={t('active-licensees')}
                    description={
                      userData.active_licensees
                        ? activeLicenseesChoices.filter(
                            (item) => item.min === userData.active_licensees[0]
                          )[0]?.value
                        : t('please-enter-information')
                    }
                    visible={userData.publicly_visible.includes(
                      'active_licensees'
                    )}
                    notVisible={
                      !userData.publicly_visible.includes('active_licensees')
                    }
                  />
                </ModalOpenButton>
                <ModalContents pencil>
                  <ActiveLicensees
                    defaultValue={
                      activeLicenseesChoices.filter(
                        (item) => item.min === userData.active_licensees[0]
                      )[0]?.value
                    }
                    defaultValueToggle={userData.publicly_visible}
                    refreshUser={refreshUser}
                    visibilityToggle={true}
                    profile={true}
                  />
                </ModalContents>
              </Modal>
            )}
            {userData.roles.includes('licensee') && (
              <Modal>
                <ModalOpenButton>
                  <BoxField
                    title={t('wholesale-volume')}
                    description={
                      userData.annual_wholesale_volume
                        ? wholesaleVolumeChoices.filter(
                            (item) =>
                              item.min === userData.annual_wholesale_volume[0]
                          )[0]?.value
                        : t('please-enter-information')
                    }
                    visible={userData.publicly_visible.includes(
                      'annual_wholesale_volume'
                    )}
                    notVisible={
                      !userData.publicly_visible.includes(
                        'annual_wholesale_volume'
                      )
                    }
                  />
                </ModalOpenButton>
                <ModalContents pencil>
                  <WholesaleVolume
                    defaultValue={
                      wholesaleVolumeChoices.filter(
                        (item) =>
                          item.min === userData.annual_wholesale_volume[0]
                      )[0]?.value
                    }
                    refreshUser={refreshUser}
                    profile={true}
                    defaultValueToggle={userData.publicly_visible}
                    visibilityToggle={true}
                  />
                </ModalContents>
              </Modal>
            )}
            {userData.roles.includes('licensee') && (
              <Modal>
                <ModalOpenButton>
                  <BoxField
                    title={t('channels-of-distribution')}
                    description={
                      userData.distribution_channels.length > 0
                        ? userData.distribution_channels
                        : t('please-enter-information')
                    }
                  />
                </ModalOpenButton>
                <ModalContents pencil>
                  <UserChannels
                    defaultValue={userData.distribution_channels}
                    refreshUser={refreshUser}
                  />
                </ModalContents>
              </Modal>
            )}
            <Modal>
              <ModalOpenButton>
                <BoxField
                  title={t('onboarding.about-my-company-title')}
                  description={
                    userData.about
                      ? userData.about
                      : t('please-enter-information')
                  }
                  visible={userData.publicly_visible.includes('about')}
                  notVisible={!userData.publicly_visible.includes('about')}
                />
              </ModalOpenButton>
              <ModalContents pencil>
                <About
                  defaultValue={userData.about}
                  refreshUser={refreshUser}
                  defaultValueToggle={userData.publicly_visible}
                  visibilityToggle={true}
                />
              </ModalContents>
            </Modal>
          </Accordion>
        </div>
      )}
    </>
  );
};

export default UserProfile;
