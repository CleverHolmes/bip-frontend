import React from 'react';
import { useTranslation } from 'next-i18next';
import { RadioGroup } from '@headlessui/react';
import Image from 'next/image';

import { ItemByUUIDResponse } from 'models/item/item';
import customImageLoader from 'utils/image-loader';
import CheckIcon from './CheckIcon';

interface Props {
  properties: ItemByUUIDResponse[];
  selectedProperty: ItemByUUIDResponse | undefined;
  setSelectedProperty: React.Dispatch<
    React.SetStateAction<ItemByUUIDResponse | undefined>
  >;
}

const LicensorProperties: React.FC<Props> = ({
  properties,
  selectedProperty,
  setSelectedProperty,
}) => {
  const { t } = useTranslation();

  return (
    <div className="w-full pb-12">
      <div className="w-full max-w-md mx-auto">
        <RadioGroup value={selectedProperty} onChange={setSelectedProperty}>
          <RadioGroup.Label className="sr-only">
            {t('property-selection')}
          </RadioGroup.Label>
          <div className="space-y-2">
            {properties.length > 0 &&
            properties.filter(
              (property: ItemByUUIDResponse) =>
                property.permitted_deal_types.length > 0
            ).length > 0 ? (
              properties
                .filter(
                  (property: ItemByUUIDResponse) =>
                    property.permitted_deal_types.length > 0
                )
                .map((property: ItemByUUIDResponse) => (
                  <RadioGroup.Option
                    key={property.uuid}
                    value={property}
                    className={({ checked }) =>
                      `${
                        checked
                          ? 'bg-backgroundInput bg-opacity-75 text-primary ring-2 ring-button ring-opacity-60 ring-offset-2 ring-offset-button/50'
                          : 'bg-white'
                      }
                    relative flex cursor-pointer rounded-lg px-5 py-4 shadow-lg focus:outline-none hover:bg-backgroundInput`
                    }
                  >
                    {({ active, checked }) => (
                      <>
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center">
                            <div className="flex items-center justify-center w-16 h-16 mr-5 cursor-pointer">
                              {property.user.company_logo?.uri && (
                                <div
                                  className={`relative flex items-center justify-center w-12 h-12 uppercase rounded-xl bg-white cursor-pointer max-h-12 max-w-12`}
                                >
                                  <Image
                                    loader={customImageLoader}
                                    src={property.user.company_logo.uri}
                                    alt={property.name}
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
                                  checked ? 'text-primary' : 'text-inputGray'
                                }`}
                              >
                                {property.name}
                              </RadioGroup.Label>
                              <RadioGroup.Description
                                as="span"
                                className={`inline ${
                                  checked ? 'text-primary' : 'text-inputGrap'
                                }`}
                              >
                                <span className="line-clamp-6">
                                  {property.description}
                                </span>{' '}
                                <span aria-hidden="true">&middot;</span>{' '}
                              </RadioGroup.Description>
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
                ))
            ) : (
              <div className="text-lg text-center text-inputGray font-custom1">
                {t('nothing-found')}
              </div>
            )}
          </div>
        </RadioGroup>
      </div>
    </div>
  );
};

export default LicensorProperties;
