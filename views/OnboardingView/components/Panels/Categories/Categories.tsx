import { useTranslation } from 'next-i18next';
import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';

import Button from 'components/new/Button';
import useStore from 'modules/Store';
import { StepperContext } from 'pages/onboarding';
import { brandCategories } from 'public/helpers/data';
import CategoryList from 'components/new/CategoryList';

type CategoriesFormProperties = {
  brand_categories: Array<string>;
};

const Categories = () => {
  const { t } = useTranslation();
  const { handleSubmit, setValue, watch } = useForm<CategoriesFormProperties>({
    defaultValues: {
      brand_categories: [],
    },
  });

  const categories = watch('brand_categories');

  const { activeStepNumber, setActiveStepNumber } = useContext(StepperContext);

  const onSubmit = handleSubmit((data) => {
    useStore.setState({ brand_categories: data.brand_categories });
    setActiveStepNumber(activeStepNumber + 1);
  });
  const handleClick = (category: string) => {
    // if category is already selected, remove it from the list
    if (categories.includes(category)) {
      const selectedCategories = categories.filter((c) => c !== category);

      setValue('brand_categories', selectedCategories);
    } else {
      // otherwise, add it to the list
      const selectedCategories = [...categories, category];
      setValue('brand_categories', selectedCategories);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="flex flex-col md:ml-[-1.56rem] xs:p-5 md:p-20 md:min-h-[15.6rem] items-center mt-[4rem] md:mt-[5rem]">
        <div className="w-full lg:w-3/4">
          <h1 className="font-bold mb-48">
            {t('onboarding.categories-your-company-works-with')}
          </h1>

          <CategoryList
            categories={brandCategories}
            activeCategories={categories}
            onCategoryClick={handleClick}
          />
        </div>
        <div
          className={
            'w-full lg:w-3/4 flex flex-row justify-end items-center mt-40 md:mt-32'
          }
        >
          <Button size="sm" className="w-full md:w-auto">
            {t('onboarding.save-and-continue')}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default Categories;
