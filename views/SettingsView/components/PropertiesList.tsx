import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'next-i18next';
import { NextRouter, useRouter } from 'next/router';
import { toast } from 'react-toastify';
import Link from 'next/link';

import { ItemByUUIDResponse } from 'models/item/item';
import { patchItem } from 'api/item/patchItem';
import { findItems, findItemsQueryKey } from 'api/item/findItems';
import Toast from 'components/Toast';
import { throwError } from 'utils/error';
import SmartCropImage from 'components/SmartCropImage';
import Icon from 'components/Icon';
import DialogModal from 'components/DialogModal';
import Button from 'components/Buttons/Button';
import { getCurrentUuid } from 'utils/getCurrentUuid';

const PropertiesList: React.FC = () => {
  const { t } = useTranslation();
  const router: NextRouter = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [propertyDelete, setPropertyDelete] = useState<string>('');
  const [propertyUUIDDelete, setPropertyUUIDDelete] = useState<string>('');
  const queryClient = useQueryClient();
  const currentUuid = getCurrentUuid();

  const { data: properties } = useQuery({
    queryKey: [findItemsQueryKey, currentUuid],
    queryFn: async () => {
      return await findItems({
        params: {
          user_uuid: currentUuid,
        },
      });
    },
    enabled: !!currentUuid,
    onError: (err) => {
      throwError(err);
    },
  });

  function closeModal() {
    setIsOpen(false);
    setPropertyDelete('');
    setPropertyUUIDDelete('');
  }

  function openModal() {
    setIsOpen(true);
  }

  const delistItem = async (uuid: string) => {
    const item = {
      permitted_deal_types: [],
      uuid,
    };
    try {
      await patchItem(item);
      queryClient.invalidateQueries({
        queryKey: [findItemsQueryKey],
      });
      closeModal();
      toast(<Toast message={`${t('settings.listing-has-been-delisted')}`} />);
    } catch (err) {
      throwError(err);
    }
  };
  return (
    <div className="text-xl font-bold font-custom1 lg:text-3xl text-primary">
      {t('settings.brands')}
      {properties && properties.length === 0 && (
        <div className="mt-20 text-lg font-normal text-center text-inputGray font-custom1">
          {t('settings.you-currently-have-no-listings')}
          <br />
          <br />
          <Link href="/add-product">
            <span className="z-40 mx-1 underline cursor-pointer hover:text-button">
              {t('settings.click-here-to-make-a-listing')}
            </span>
          </Link>{' '}
        </div>
      )}
      {properties &&
        properties.map((property: ItemByUUIDResponse, index: number) => {
          return (
            <div
              key={`${property.name}-${index}`}
              className="flex items-center justify-between py-6 border-b-2 md:col-span-2 border-horizontalDivider"
            >
              <div
                className="flex items-center justify-center cursor-pointer"
                onClick={() => {
                  router.push(`/product/${property.name}/${property.uuid}`);
                }}
              >
                {property.image_logo && (
                  <div className="rounded-xl bg-white relative w-[60px] h-[60px]">
                    <SmartCropImage
                      image={property.image_logo}
                      params={{ width: 200, height: 200, minScale: 1 }}
                      alt={'image-' + index}
                      radius={12}
                    />
                  </div>
                )}
                <div className="ml-6 text-xl text-primary font-custom1 text-bold">
                  {property.name}
                </div>
              </div>
              {property.permitted_deal_types.length > 0 && (
                <div className="flex items-center justify-center w-12 h-12 mr-10 rounded-lg shadow-lg 2xl:mr-0 hover:bg-button">
                  <div className="relative inline-block w-full h-full group">
                    <Icon
                      name="ThreeDots"
                      className="h-full mx-auto my-auto cursor-pointer fill-primary hover:fill-white"
                      viewBox="0 0 20 4"
                      size="18"
                    />
                    <div className="absolute z-20 hidden text-base rounded-lg shadow-lg top-10 right-4 sm:left-4 sm:right-auto w-30 font-custom1 text-primary group-hover:block group-hover:bg-white">
                      <div
                        className="flex w-full px-8 py-3 rounded-b-lg cursor-pointer hover:bg-backgroundInput"
                        onClick={() => {
                          openModal();
                          setPropertyDelete(property.name);
                          setPropertyUUIDDelete(property.uuid);
                        }}
                      >
                        {t('settings.delist')}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      <DialogModal
        closeModal={closeModal}
        isOpen={isOpen}
        dialogTitle={t('settings.delist-listing')}
      >
        <div className="py-10 mx-auto text-lg font-custom1 font-primary">{`${t(
          'settings.are-you-sure-you-want-to-delist'
        )} ${propertyDelete} ?`}</div>
        <Button
          onClick={() => propertyUUIDDelete && delistItem(propertyUUIDDelete)}
        >
          {t('settings.delist-listing')}
        </Button>
      </DialogModal>
    </div>
  );
};

export default PropertiesList;
