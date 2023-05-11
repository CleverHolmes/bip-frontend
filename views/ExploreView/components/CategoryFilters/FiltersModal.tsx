import { useTranslation } from 'next-i18next';
import React, { ChangeEvent, useState } from 'react';

import Checkbox from 'components/new/Checkbox';
import InputField from 'components/new/InputField';
import Modal from 'components/new/NewModal';
import RangeSlider from 'components/new/RangeSlider';
import {
  channelsOfDist,
  listOfCategories,
  listOfTerritories,
} from 'public/helpers/data';

type FiltersModalProperties = {
  openModal: boolean;
  closeModal: () => void;
  territoriesFilter: { selections: ChangeEvent<HTMLInputElement>[] };
  categoriesFilter: { selections: ChangeEvent<HTMLInputElement>[] };
  channelsOfDistributionFilter: {
    selections: ChangeEvent<HTMLInputElement>[];
  };
  toggleCategoriesFilter: (item: ChangeEvent<HTMLInputElement>) => void;
  toggleEvent: (item: ChangeEvent<HTMLInputElement>) => void;
  toggleChannels: (item: ChangeEvent<HTMLInputElement>) => void;
  applyFilters: () => void;
  clearAllFilters: () => void;
  rangeValue: { min: number; max: number };
  handleChangeRange: (value: { max: number; min: number }) => void;
  handleChangeField: (event: any, name: string) => void;
  handleChangeFieldDollar: (event: any, name: string) => void;
  minimumGuaranteeAmountMax?: string | number;
  minimumGuaranteeAmountMin?: string | number;
};

const FiltersModal: React.FC<FiltersModalProperties> = ({
  openModal,
  closeModal,
  territoriesFilter,
  categoriesFilter,
  channelsOfDistributionFilter,
  toggleCategoriesFilter,
  toggleEvent,
  toggleChannels,
  applyFilters,
  clearAllFilters,
  rangeValue,
  handleChangeRange,
  handleChangeField,
  handleChangeFieldDollar,
  minimumGuaranteeAmountMax,
  minimumGuaranteeAmountMin,
}) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('percentage');
  const [valueDollar, setValueDollar] = React.useState({ min: 0, max: 1000 });
  const fieldType = activeTab === 'percentage' ? 'Percent' : 'Dollar';

  return (
    <Modal
      className="!max-w-[51rem]"
      modalTitle={t('explorePage.filtersModal.filters')}
      isOpen={openModal}
      closeModal={closeModal}
      buttonSecondary={t('explorePage.filtersModal.reset-all')}
      buttonPrimary={t('explorePage.filtersModal.apply-filters')}
      onPrimaryAction={applyFilters}
      onSecondaryAction={clearAllFilters}
    >
      <div className="flex flex-col">
        <div className="mb-24 text-xl font-bold text-left font-headings text-grayN500">
          {t('explorePage.filtersModal.product-categories')}
        </div>
        <div className="grid md:grid-rows-9 grid-flow-row md:grid-flow-col md:gap-x-[120px] gap-y-24">
          {listOfCategories.map((item: any, index: number) => {
            return (
              <div key={index + '-category'} className="w-[17rem]">
                <Checkbox
                  label={item.value}
                  checked={
                    categoriesFilter.selections.filter(
                      (e: any) => e?.target.value === item.value
                    ).length === 1
                  }
                  onChange={toggleCategoriesFilter}
                  value={item.value}
                />
              </div>
            );
          })}
        </div>
        <div className="mb-24 mt-32 text-xl font-bold text-left font-headings text-grayN500">
          {t('explorePage.filtersModal.territories')}
        </div>
        <div className="grid md:grid-rows-10 grid-flow-row md:grid-flow-col md:gap-x-[120px] gap-y-24">
          {listOfTerritories.map((item: any, index: number) => {
            return (
              <div key={index + '-territory'} className="w-[17rem]">
                <Checkbox
                  label={item.value}
                  checked={
                    territoriesFilter.selections.filter(
                      (e: any) => e.target.value === item.value
                    ).length === 1
                  }
                  onChange={toggleEvent}
                  value={item.value}
                />
              </div>
            );
          })}
        </div>
        <div className="mb-24 mt-32 text-xl font-bold text-left font-headings text-grayN500">
          {t('explorePage.filtersModal.distribution-channels')}
        </div>
        <div className="grid md:grid-rows-5 grid-flow-row md:grid-flow-col md:gap-x-[120px] gap-y-24">
          {channelsOfDist.map((item: any, index: number) => {
            return (
              <div key={index + '-distri'} className="w-[17rem]">
                <Checkbox
                  label={item.value}
                  checked={
                    channelsOfDistributionFilter.selections.filter(
                      (e: any) => e.target.value === item.value
                    ).length === 1
                  }
                  onChange={toggleChannels}
                  value={item.value}
                />
              </div>
            );
          })}
        </div>
        <div className="mb-24 mt-32 text-xl font-bold text-left font-headings text-grayN500">
          {t('explorePage.filtersModal.minimum-guarantee')}
        </div>
        <div className="flex flex-row -mx-24">
          <div
            className={
              'w-1/2 py-12 flex justify-center cursor-pointer' +
              (activeTab === 'percentage'
                ? ' border-b-2 border-blueN300 '
                : ' border-b border-grayN50 ')
            }
            onClick={() => setActiveTab('percentage')}
          >
            <span className="text-grayN500 text-sm font-headings tracking-wide">
              {t('explorePage.filtersModal.by-percentage')}
            </span>
          </div>
          <div
            className={
              'w-1/2 py-12 flex justify-center cursor-pointer' +
              (activeTab === 'dollar'
                ? ' border-b-2 border-blueN300 '
                : ' border-b border-grayN50 ')
            }
            onClick={() => setActiveTab('dollar')}
          >
            <span className="text-grayN500 text-sm font-headings tracking-wide">
              {t('explorePage.filtersModal.by-dollars')}
            </span>
          </div>
        </div>

        {activeTab === 'percentage' && (
          <>
            <div>
              <RangeSlider
                step={5}
                min={0}
                max={100}
                value={rangeValue}
                onChange={handleChangeRange}
                identifier="%"
              />
            </div>
            <div className="flex flex-col sm:flex-row justify-between gap-16 sm:gap-0 sm:space-x-2 mt-28 md:mt-24">
              <InputField
                leftIcon="Percent"
                value={rangeValue.min}
                helperText={t('explorePage.filtersModal.minimun')}
                onChange={(e) => handleChangeField(e, 'min')}
              />
              <InputField
                rightIcon="Percent"
                value={rangeValue.max}
                helperText={t('explorePage.filtersModal.maximun')}
                onChange={(e) => handleChangeField(e, 'max')}
              />
            </div>
          </>
        )}
        {activeTab === 'dollar' && (
          <>
            <div className="flex flex-col sm:flex-row justify-between gap-16 sm:gap-0 sm:space-x-2 mt-28 md:mt-24">
              <InputField
                leftIcon="Dollar"
                value={minimumGuaranteeAmountMin}
                helperText={t('explorePage.filtersModal.minimun')}
                onChange={(e) => handleChangeFieldDollar(e, 'min')}
              />
              <InputField
                rightIcon="Dollar"
                value={minimumGuaranteeAmountMax}
                helperText={t('explorePage.filtersModal.maximun')}
                onChange={(e) => handleChangeFieldDollar(e, 'max')}
              />
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

export default FiltersModal;
