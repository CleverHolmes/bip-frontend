import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'next-i18next';
import { useQuery } from '@tanstack/react-query';
import { RadioGroup } from '@headlessui/react';
import Image from 'next/image';
import { Trans } from 'react-i18next';
import Link from 'next/link';

import Modal from 'components/new/Modal';
import { getCurrentUuid } from 'utils/getCurrentUuid';
import { findItems, findItemsQueryKey } from 'api/item/findItems';
import { delegate, delegateQueryKey } from 'api/delegate/delegate';
import useCheckRole from 'hooks/useCheckRole';
import { ItemByUUIDResponse } from 'models/item/item';
import { UserByUuidResponse } from 'models/user/user';
import BackButton from 'components/Buttons/BackButton';
import LicensorPropertiesCheckbox from 'views/ProductView/components/LicensorPropertiesCheckbox';
import LicensorProperties from 'views/ProductView/components/LicensorProperties';
import Button from 'components/Buttons/Button';
import CheckIcon from 'views/ProductView/components/CheckIcon';
import customImageLoader from 'utils/image-loader';
import CircleLoaderSpinner from 'components/CircleLoaderSpinner';
import routes from 'constants/routes';
import { Delegate, DelegateItem } from 'models/delegate/delegate';

interface Props {
  isOpen: boolean;
  submitting: boolean;
  onSubmit: (selectedProperty?: ItemByUUIDResponse) => void;
  onClose: () => void;
}

const ChooseBrandModal: React.FC<Props> = ({
  isOpen,
  submitting,
  onSubmit,
  onClose,
}) => {
  const { t } = useTranslation();
  const { isLicensee, isLicensor, isAgency, isActingAsAgency } = useCheckRole();
  const currentUuid = getCurrentUuid();

  const [selectedProperty, setSelectedProperty] =
    useState<ItemByUUIDResponse>();
  const [selectedDelegate, setSelectedDelegate] =
    useState<UserByUuidResponse>();
  const [showBrands, setShowBrands] = useState(false);
  const [error, setError] = useState('');

  const { isLoading: isLoadingItems, data: properties } = useQuery({
    queryKey: [findItemsQueryKey, selectedDelegate?.uuid || currentUuid],
    queryFn: async () => {
      return await findItems({
        params: {
          user_uuid: selectedDelegate?.uuid || currentUuid,
        },
      });
    },
    enabled: showBrands,
  });

  const { isLoading: isLoadingDelegates, data: delegates } = useQuery({
    queryKey: [delegateQueryKey, currentUuid],
    queryFn: async () => {
      return await delegate({
        params: { delegate_uuid: currentUuid },
      });
    },
    enabled: isActingAsAgency && !!currentUuid,
  });

  const isActingLicensor = (isAgency && !isActingAsAgency) || isLicensor;
  const isLoading =
    (showBrands && isLoadingItems) || (!showBrands && isLoadingDelegates);

  const checkPermittedDealTypes = (delegateItems: DelegateItem[]) => {
    let showDelegate = false;

    delegateItems.find((item) => {
      if (item.permitted_deal_types.length > 0) {
        showDelegate = true;
      }
    });

    return showDelegate;
  };

  const filteredDelegates = useMemo(() => {
    if (!delegates) {
      return [];
    }
    return delegates.filter((delegate) =>
      checkPermittedDealTypes(delegate.items)
    );
  }, [delegates]);
  const filteredProperties = useMemo(() => {
    if (!properties) {
      return [];
    }
    return properties.filter((property) => checkPermittedDealTypes([property]));
  }, [properties]);

  const title: string = useMemo(() => {
    if (
      (!isLoading && !showBrands && !filteredDelegates?.length) ||
      (!isLoading && showBrands && !filteredProperties?.length)
    ) {
      return t('oops');
    }

    if (!showBrands && filteredDelegates?.length) {
      return t('choose-a-licensor');
    }

    return t('choose-a-brand');
  }, [showBrands, filteredDelegates, filteredProperties]);

  useEffect(() => {
    if (!isLicensee && (selectedDelegate || isActingLicensor)) {
      setShowBrands(true);
    } else {
      setShowBrands(false);
      setError('');
      setSelectedProperty(undefined);
    }
  }, [isLicensee, isActingLicensor, selectedDelegate]);

  const handleClickBackButton = () => {
    setSelectedDelegate(undefined);
  };

  const handleClickSendRequest = () => {
    if (!selectedProperty) {
      setError('*Please choose at lease one property');
      return;
    }

    onSubmit(selectedProperty);
  };

  return (
    <Modal isOpen={isOpen} title={title} closeModal={onClose}>
      {isLoading && (
        <div className="flex w-full mt-[50px]">
          <CircleLoaderSpinner className="mx-auto" size={200} />
        </div>
      )}
      {!isLoading && (
        <div className="mt-10">
          {selectedDelegate && (
            <div className="px-4 mb-6">
              <BackButton onClick={handleClickBackButton} />
            </div>
          )}
          {((!showBrands && !filteredDelegates?.length) ||
            (showBrands && !filteredProperties?.length)) && (
            <div className="w-[33rem] text-xl text-center">
              <Trans
                i18nKey={'you-dont-have-licensors'}
                components={{
                  secondary: <span className="text-button font-bold" />,
                }}
              />
              <div className="flex items-center justify-center mt-12">
                <Button>
                  <Link
                    href={
                      isActingLicensor ? routes.addProduct : routes.addLicensor
                    }
                  >
                    <a className="w-full">{t('add-brand')}</a>
                  </Link>
                </Button>
              </div>
            </div>
          )}
          {!showBrands && !!filteredDelegates?.length && (
            <div className="w-full pb-12">
              <div className="w-full max-w-md mx-auto">
                <RadioGroup
                  value={selectedDelegate}
                  onChange={setSelectedDelegate}
                >
                  <RadioGroup.Label className="sr-only">
                    {t('property-selection')}
                  </RadioGroup.Label>
                  <div className="space-y-2">
                    {filteredDelegates?.map((delegate: Delegate) => (
                      <RadioGroup.Option
                        key={delegate.uuid}
                        value={delegate}
                        className={({ checked }) =>
                          `${
                            checked
                              ? 'bg-backgroundInput bg-opacity-75 text-primary ring-2 ring-button ring-opacity-60 ring-offset-2 ring-offset-button/50'
                              : 'bg-white'
                          }
                          relative flex cursor-pointer rounded-lg px-5 py-4 shadow-lg focus:outline-none hover:bg-backgroundInput`
                        }
                      >
                        {({ checked }) => (
                          <>
                            <div className="flex items-center justify-between w-full">
                              <div className="flex items-center">
                                <div className="flex items-center justify-center w-16 h-16 mr-5 cursor-pointer">
                                  {delegate.company_logo.uri && (
                                    <div
                                      className={`relative flex items-center justify-center w-12 h-12 uppercase rounded-xl bg-white cursor-pointer max-h-12 max-w-12`}
                                    >
                                      <Image
                                        loader={customImageLoader}
                                        src={delegate.company_logo.uri}
                                        alt={delegate.company_name}
                                        layout="fill"
                                        width={24}
                                        objectFit={'contain'}
                                        className={`mx-auto rounded-xl`}
                                      />
                                    </div>
                                  )}
                                </div>
                                <div className="text-lg">
                                  <RadioGroup.Label
                                    as="p"
                                    className={`font-medium  ${
                                      checked
                                        ? 'text-primary'
                                        : 'text-inputGray'
                                    }`}
                                  >
                                    {delegate.company_name}
                                  </RadioGroup.Label>
                                </div>
                              </div>
                              {checked && (
                                <div className="text-button shrink-0">
                                  <CheckIcon className="w-6 h-6" />
                                </div>
                              )}
                            </div>
                          </>
                        )}
                      </RadioGroup.Option>
                    ))}
                  </div>
                </RadioGroup>
              </div>
            </div>
          )}
          {showBrands && !!filteredProperties?.length && (
            <div>
              {properties && properties.length > 5 && (
                <LicensorPropertiesCheckbox
                  properties={properties}
                  selectedProperty={selectedProperty}
                  setSelectedProperty={setSelectedProperty}
                />
              )}
              {properties && properties.length <= 5 && (
                <LicensorProperties
                  properties={properties}
                  selectedProperty={selectedProperty}
                  setSelectedProperty={setSelectedProperty}
                />
              )}
              {error && (
                <div className="mb-4 text-sm text-center text-red-400 font-custom2">
                  {error && error}
                </div>
              )}
              {filteredProperties?.length > 0 && (
                <div className="flex items-center justify-center">
                  <Button
                    disabled={submitting}
                    onClick={handleClickSendRequest}
                  >
                    {t('request-deal')}
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </Modal>
  );
};

export default ChooseBrandModal;
