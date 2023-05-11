import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';
import * as _ from 'lodash';

import useExploreFilters from './hooks/useExploreFilters';
import Widget from './components/Widget';
import CategoryFilters from './components/CategoryFilters';
import TopBrands from './components/TopBrands';
import Carousel from './components/Carousel';
import Slider from './components/Slider';
import { usePagination } from 'hooks/usePagination';
import FiltersModal from './components/CategoryFilters/FiltersModal';

const ExploreView: React.FC = () => {
  const { t } = useTranslation();
  const [openModal, setOpenModal] = useState(false);
  const { handleChangePage } = usePagination();
  const {
    categories,
    originalCategories,
    isLoading,
    isFiltered,
    range,
    minimumGuaranteeAmountMax,
    minimumGuaranteeAmountMin,
    categoriesFilter,
    toggleCategoriesFilter,
    territoriesFilter,
    toggleEvent,
    channelsOfDistributionFilter,
    toggleChannels,
    handleChangeField,
    handleChangeRange,
    applyFilters,
    clearAllFilters,
    handleChangeFieldDollar,
  } = useExploreFilters();

  const handleApply = () => {
    setOpenModal(false);
    applyFilters();
  };

  const handleToggleModal = () => setOpenModal(!openModal);

  const clearFilters = () => {
    setOpenModal(false);
    clearAllFilters();
  };

  // Invoke when user click to request another page.
  const handlePageClick = (newPage: number) => {
    handleChangePage(newPage);
  };

  return (
    <>
      <Slider />
      <div className="hidden lg:flex flex-row items-center justify-between mt-40 mb-60 max-w-screen-2lg mx-auto px-24">
        <Widget
          title={t('explorePage.monitor-all-your-brands')}
          subtitle={t('explorePage.find-valuable-stats-in-the-dashboard')}
          iconName="Bars"
        />
        <Widget
          title={t('explorePage.all-your-docs-safe-and-accessible')}
          subtitle={t('explorePage.with-vault-you')}
          iconName="Doc"
        />
        <Widget
          title={t('explorePage.negotiate-with-licensors')}
          subtitle={t('explorePage.with-our-chat')}
          iconName="Chat"
        />
      </div>
      <CategoryFilters
        className="pl-20 md:pl-24 mt-24 lg:mt-0"
        categories={originalCategories}
        loading={isLoading}
        toggleModal={handleToggleModal}
        isFiltering={isFiltered}
      />
      <TopBrands className="pl-20 md:pl-24" />
      {isLoading && (
        <div
          className="flex flex-row items-center justify-center my-24"
          role="status"
        >
          <svg
            aria-hidden="true"
            className="w-20 h-20 mr-2 text-blueN200 animate-spin fill-blueN500"
            viewBox="0 0 100 101"
            fill="none"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span className="sr-only">{t('loading')}</span>
        </div>
      )}
      {categories &&
        Object.entries(categories).map(([category, products]) => (
          <Carousel
            key={category}
            className={
              'pl-20 md:pl-24 ' + category.replace(/\s+/g, '-').toLowerCase()
            }
            carouselName={category}
            brandList={products}
          />
        ))}
      <FiltersModal
        openModal={openModal}
        closeModal={() => setOpenModal(false)}
        territoriesFilter={territoriesFilter}
        categoriesFilter={categoriesFilter}
        channelsOfDistributionFilter={channelsOfDistributionFilter}
        toggleCategoriesFilter={toggleCategoriesFilter}
        toggleEvent={toggleEvent}
        toggleChannels={toggleChannels}
        applyFilters={handleApply}
        clearAllFilters={clearFilters}
        rangeValue={range}
        minimumGuaranteeAmountMax={minimumGuaranteeAmountMax}
        minimumGuaranteeAmountMin={minimumGuaranteeAmountMin}
        handleChangeRange={handleChangeRange}
        handleChangeField={handleChangeField}
        handleChangeFieldDollar={handleChangeFieldDollar}
      />
    </>
  );
};

export default ExploreView;
