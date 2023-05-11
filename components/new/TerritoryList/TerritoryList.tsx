import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useFormContext } from 'react-hook-form';

import Radio from 'components/new/Radio';
import Chip from 'components/new/Chip';
import { listOfTerritories, typesOfTerritories } from 'public/helpers/data';
import type { CompanyInfoFormProperties } from 'views/OnboardingView/components/Panels/CompanyInfo/CompanyInfoProperties.types';

const TerritoryList = () => {
  const { t } = useTranslation();

  const { setValue, watch } = useFormContext<CompanyInfoFormProperties>();
  const [isGlobal, setIsGlobal] = useState(false);

  const territories = watch('territories');

  const handleClick = (id: number) => {
    // if territory is already selected, remove it from the list
    if (territories.includes(id.toString())) {
      const selectedTerritories = territories
        .filter((territory) => territory !== id.toString())
        .map((territory) => territory.toString());

      setValue('territories', selectedTerritories);
    } else {
      // otherwise, add it to the list
      const selectedTerritories = [...territories, id].map((territory) =>
        territory.toString()
      );
      setValue('territories', selectedTerritories);
    }
  };

  const handleSelectAll = (type: string) => {
    const selectedTypeTerritories = listOfTerritories.filter(
      (territory) => territory.type === type
    );
    const selectedTerritories = territories
      .concat(
        selectedTypeTerritories.map((territory) => territory.id.toString())
      )
      .map((territory) => territory.toString());
    setValue('territories', selectedTerritories);
  };

  const handleGlobal = () => {
    if (!isGlobal) {
      setValue(
        'territories',
        listOfTerritories.map((territory) => territory.id.toString())
      );
      setIsGlobal(true);
    } else {
      setValue('territories', []);
      setIsGlobal(false);
    }
  };

  const allTypeTerritories = (type: string) =>
    listOfTerritories.filter((territory) => territory.type === type);

  const allTerritoriesSelectedForType = (type: string) => {
    const selectedTypeTerritories = listOfTerritories.filter(
      (territory) =>
        territory.type === type && territories.includes(territory.id.toString())
    );
    return allTypeTerritories(type).length === selectedTypeTerritories.length;
  };

  return (
    <div className={'w-full min-h-fit'}>
      <div className={'flex flex-row justify-start pb-5 pt-5'}>
        <Chip
          label={t('onboarding.globally')}
          selected={isGlobal}
          className={'mr-5 h-32'}
          removable={true}
          onClick={handleGlobal}
        />
      </div>
      {typesOfTerritories.map((type) => (
        <div key={type} className={'mb-5 min-h-fit'}>
          <div className={'w-full flex flex-row justify-start mb-1'}>
            <h1>
              <b>{type}</b>
            </h1>
            <Radio
              name={type}
              key={type}
              label={t('select_all')}
              selected={allTerritoriesSelectedForType(type)}
              className={'ml-5'}
              onClick={() => handleSelectAll(type)}
            />
          </div>
          <div className="flex flex-row justify-start flex-wrap gap-8">
            {listOfTerritories
              .filter((territory) => territory.type === type)
              .map((territory) => (
                <Chip
                  key={territory.id}
                  noWrap
                  label={territory.value}
                  selected={territories.includes(territory.id.toString())}
                  className="h-32"
                  removable={territories.includes(territory.id.toString())}
                  onClick={() => handleClick(territory.id)}
                />
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TerritoryList;
