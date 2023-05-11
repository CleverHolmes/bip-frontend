import { useTranslation } from 'next-i18next';
import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';

import Button from 'components/new/Button';
import InputWithTags from 'components/new/TagInput';
import useStore from 'modules/Store';
import { StepperContext } from 'pages/onboarding';

export type YourBrandsData = {
  brands: Array<string>;
};

type YourBrandsFormProperties = {
  brands_represented: Array<string>;
};

const YourBrands = () => {
  const { t } = useTranslation();
  const { handleSubmit, setValue, watch } = useForm<YourBrandsFormProperties>();

  const brands = watch('brands_represented');

  const { activeStepNumber, setActiveStepNumber } = useContext(StepperContext);

  const handleDelete = (index: number) => {
    const values = brands.filter((_, i) => i !== index);
    setValue('brands_represented', values);
  };

  const handleChange = (tags: string[]) => {
    const brands = tags.map((tag) => tag.trim());
    setValue('brands_represented', brands);
  };

  const onSubmit = handleSubmit((data) => {
    useStore.setState({ brands_represented: data.brands_represented });
    setActiveStepNumber(activeStepNumber + 1);
  });

  return (
    <form onSubmit={onSubmit}>
      <div className="flex flex-col md:ml-[-1.56rem] xs:p-5 md:p-20 md:min-h-[15.6rem] items-center mt-[4rem] md:mt-[5rem]">
        <div className="w-full lg:w-3/4">
          <h1 className="hidden md:block font-bold mb-48 font-headings">
            {t('onboarding.name-5-brands-that-your-represent')}
          </h1>
        </div>
        <InputWithTags
          tags={brands}
          limit={5}
          textFieldLabel={t('onboarding.your-brands')}
          placeholder={t(
            'onboarding.type-your-brands-separate-them-with-a-comma'
          )}
          onChange={(tags) => handleChange(tags)}
          onDelete={(index) => handleDelete(index)}
        />
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

export default YourBrands;
