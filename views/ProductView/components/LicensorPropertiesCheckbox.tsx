import React, { Fragment, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { Combobox, Transition } from '@headlessui/react';
import { ChevronUpDownIcon } from '@heroicons/react/20/solid';

import { ItemByUUIDResponse } from 'models/item/item';
import OwnImage from 'components/Image';
import CheckIcon from './CheckIcon';

interface Props {
  properties: ItemByUUIDResponse[];
  selectedProperty: ItemByUUIDResponse | undefined;
  setSelectedProperty: React.Dispatch<
    React.SetStateAction<ItemByUUIDResponse | undefined>
  >;
}

const LicensorPropertiesCheckbox: React.FC<Props> = ({
  properties,
  selectedProperty,
  setSelectedProperty,
}) => {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const filteredProperties =
    query === ''
      ? properties.filter(
          (property: ItemByUUIDResponse) =>
            property.permitted_deal_types.length > 0
        )
      : properties.filter(
          (property: ItemByUUIDResponse) =>
            property.name
              .toLowerCase()
              .replace(/\s+/g, '')
              .includes(query.toLowerCase().replace(/\s+/g, '')) &&
            property.permitted_deal_types.length > 0
        );
  return (
    <div className="w-full pb-12">
      <div className="w-full max-w-md mx-auto">
        <Combobox value={selectedProperty} onChange={setSelectedProperty}>
          <div className="relative mt-1">
            <div className="relative flex flex-wrap w-full text-left bg-white rounded-lg shadow-lg cursor-pointer">
              <Combobox.Input
                className="w-full py-5 pl-3 pr-10 text-lg leading-5 cursor-pointer font-custom1 text-primary hover:bg-backgroundInput border-button focus:border-button active:border-button focus:ring-button focus:outline-button"
                displayValue={(property: ItemByUUIDResponse) => property.name}
                onChange={(event) => setQuery(event.target.value)}
              />
              <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon
                  className="w-6 h-6 text-inputGray"
                  aria-hidden="true"
                />
              </Combobox.Button>
            </div>
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
              afterLeave={() => setQuery('')}
            >
              <Combobox.Options className="absolute z-40 w-full py-2 mt-1 overflow-auto text-lg bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none">
                {filteredProperties.length === 0 && !!query ? (
                  <div className="relative px-4 py-2 cursor-default select-none font-custom1 text-inputGray">
                    {t('nothing-found')}
                  </div>
                ) : (
                  filteredProperties.map((property: ItemByUUIDResponse) => (
                    <Combobox.Option
                      key={property.uuid}
                      className={({ active }) =>
                        `font-custom1 relative cursor-default select-none py-2 pl-10 pr-4  ${
                          active
                            ? 'bg-backgroundInput text-primary'
                            : 'text-inputGray'
                        }`
                      }
                      value={property}
                    >
                      {({ selected }) => (
                        <div className="flex items-center justify-between w-full cursor-pointer">
                          <div className="flex items-center">
                            <div className="flex items-center justify-center w-16 h-16 mr-5">
                              {property.user.company_logo?.uri && (
                                <div className="relative w-full">
                                  <OwnImage
                                    src={property.user.company_logo.uri}
                                    alt={property.name}
                                    layout="fill"
                                    classNameImage=" rounded-t-xl"
                                  />
                                </div>
                              )}
                            </div>
                            <span
                              className={`block truncate font-custom1 ${
                                selected ? 'font-lg' : 'font-lg'
                              }`}
                            >
                              {property.name}
                            </span>
                          </div>
                          {selected ? (
                            <div className="mr-5 text-button shrink-0">
                              <CheckIcon className="w-6 h-6" />
                            </div>
                          ) : null}
                        </div>
                      )}
                    </Combobox.Option>
                  ))
                )}
              </Combobox.Options>
            </Transition>
          </div>
        </Combobox>
      </div>
    </div>
  );
};

export default LicensorPropertiesCheckbox;
