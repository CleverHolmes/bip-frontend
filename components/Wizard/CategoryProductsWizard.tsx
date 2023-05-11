import produce from 'immer';
import { useTranslation } from 'next-i18next';
import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useWizard } from 'react-use-wizard';

import BackButton from 'components/Buttons/BackButton';
import Button from 'components/Buttons/Button';
import Input from 'components/Input';
import SelectButton from 'components/Buttons/SelectButton';
import { listOfCategories } from 'public/helpers/data';
import useStore, { StoreState } from 'modules/Store';
import HeaderSplitPrimaryButton from 'components/HeaderSplitPrimaryButton';
import { UserRoles } from 'models/user/user';
import { CategoriesItem } from 'models/item/item';

interface Props {
  setActiveStepNumber: (value: number) => void;
  categoriesProducts: CategoriesItem[];
  setCategoriesProducts: any;
  coreCategories?: CategoriesItem[];
  setCategoriesCore?: any;
  storeProperty: keyof StoreState;
  storeProperty2?: keyof StoreState;
  extraText: string;
}

const CategoryProductsWizard: React.FC<Props> = ({
  setActiveStepNumber,
  categoriesProducts,
  setCategoriesProducts,
  coreCategories,
  setCategoriesCore,
  storeProperty,
  storeProperty2,
  extraText,
}) => {
  const { t } = useTranslation();
  const defaultValue: any = useStore((state) => state[storeProperty]);
  const roles = useStore.getState().roles;

  const { previousStep, nextStep, activeStep, goToStep } = useWizard();

  useEffect(() => {
    setActiveStepNumber(activeStep);
  }, [setActiveStepNumber, activeStep]);

  const { register, getValues, setValue } = useForm();

  const [error, setError] = useState<string>('');

  const addACategory = (categoryName: string) =>
    setCategoriesProducts((prevState: any) => [
      ...prevState,
      { category_name: categoryName, products: [] },
    ]);

  const addACoreCategory = (categoryName: string) => {
    setCategoriesCore((prevState: any) => [
      ...prevState,
      { category_name: categoryName, products: [] },
    ]);
  };

  const handleAddProduct = useCallback(
    (categoryName: string, product: string) => {
      product.length > 0 &&
        setCategoriesProducts(
          produce((draft: any) => {
            const category = draft.find(
              (categoriesProduct: any) =>
                categoriesProduct.category_name === categoryName
            );
            category.products.push({ product_name: product });
          })
        );
    },
    [setCategoriesProducts]
  );

  const handleRemoveProduct = useCallback(
    (categoryName: string, product: string) => {
      setCategoriesProducts(
        produce((draft: any) => {
          const categoryIndex = draft.findIndex(
            (categoriesProduct: any) =>
              categoriesProduct.category_name === categoryName
          );
          const productIndex = draft[categoryIndex].products.findIndex(
            (prod: any) => prod.product_name === product
          );
          if (productIndex !== -1)
            draft[categoryIndex].products.splice(productIndex, 1);
        })
      );
    },
    [setCategoriesProducts]
  );

  const removeACategory = (categoryName: any) => {
    setCategoriesProducts(
      categoriesProducts.filter(
        (item: any) => item.category_name !== categoryName
      )
    );
    removeACoreCategory(categoryName);
  };

  const removeACoreCategory = (categoryName: string) => {
    if (coreCategories) {
      setCategoriesCore(
        coreCategories.filter(
          (item: any) => item.category_name !== categoryName
        )
      );
    }
  };

  const toggleEvent = (categoryName: string) => {
    if (
      categoriesProducts.filter(
        (item: any) => item.category_name.trim() === categoryName.trim()
      ).length > 0
    ) {
      removeACategory(categoryName.trim());
    } else {
      addACategory(categoryName.trim());
    }
  };

  const toggleEventCore = (categoryName: string) => {
    if (
      coreCategories &&
      coreCategories.filter(
        (item: any) => item.category_name.trim() === categoryName.trim()
      ).length > 0
    ) {
      removeACoreCategory(categoryName.trim());
    } else {
      addACoreCategory(categoryName.trim());
    }
  };

  const handleEnterPressed =
    (param: string) => (event: React.KeyboardEvent<HTMLFormElement>) => {
      if (event.key.toLowerCase() === 'enter') {
        if (
          categoriesProducts
            .filter((category: any) => category.category_name === param)[0]
            .products.filter(
              (product: any) => product.product_name === event.target.value
            ).length > 0
        ) {
          setError(
            `*${t('onboarding.already-exists-can-only-enter-unique-values')}`
          );
          alert(`${t('onboarding.product-already-exists')}`);
        } else {
          handleAddProduct(param, event.target.value);
          event.target.value = '';
        }
      }
    };

  const buttonEnterPressed = (param: string) => {
    const value = getValues(param);
    if (!value) return;
    if (
      categoriesProducts
        .filter((category: any) => category.category_name === param)[0]
        .products.filter((product: any) => product.product_name === value)
        .length > 0
    ) {
      setError(
        `*${t('onboarding.already-exists-can-only-enter-unique-values')}`
      );
      alert(`${t('onboarding.product-already-exists')}`);
    } else {
      handleAddProduct(param, value);
      setValue(param, '');
    }
  };

  const onSubmit = () => {
    categoriesProducts.map((category: any) => {
      const value = getValues(category.category_name);
      if (
        !roles.includes(UserRoles.LICENSOR) &&
        value.length > 0 &&
        categoriesProducts
          .filter(
            (category2: any) =>
              category2.category_name === category.category_name
          )[0]
          .products.filter((product: any) => product.product_name === value)
          .length === 0
      ) {
        handleAddProduct(category.category_name, value);
      }
    });

    if (categoriesProducts.length > 0) {
      useStore.setState({ [storeProperty]: categoriesProducts });
      if (roles.includes(UserRoles.LICENSEE)) {
        storeProperty2 &&
          useStore.setState({ [storeProperty2]: coreCategories });
        nextStep();
      } else {
        goToStep(10);
      }
    } else {
      setError(
        `*${t('onboarding.please-choose-at-least-one-category-and-product')}`
      );
    }
  };

  const goBackAStep = () => {
    if (storeProperty === 'categories_licensee') {
      if (!roles.includes(UserRoles.LICENSOR)) {
        goToStep(5);
      } else {
        previousStep();
      }
    } else if (storeProperty === 'categories') {
      if (roles.includes(UserRoles.LICENSOR)) {
        previousStep();
      } else if (roles.includes(UserRoles.AGENCY)) {
        goToStep(6);
      } else {
        goToStep(5);
      }
    } else {
      previousStep();
    }
  };

  const selectAllProducts = () => {
    listOfCategories.map((product) => {
      const found = categoriesProducts.some(
        (category: any) => category.category_name === product.value
      );
      if (!found) addACategory(product.value.trim());
    });
  };

  const selectNoneProducts = () => {
    setCategoriesProducts([]);
  };

  const isAllSelected = categoriesProducts.length === listOfCategories.length;

  return (
    <>
      <div className="relative flex flex-col mx-6 sm:mx-20 md:mx-40 lg:container lg:mx-auto lg:pl-36">
        <div className="flex flex-col my-4">
          <label
            className={
              'mb-8 flex items-center text-lg font-bold font-custom1 md:text-xl lg:text-2xl'
            }
          >
            <div>
              <HeaderSplitPrimaryButton label="onboarding.choose-categories-your-company-works-with" />
              <span className="ml-2 text-base font-normal text-inputGray lg:text-lg">
                {extraText && `(${extraText})`}
              </span>
            </div>
            <div
              className={
                'font-normal ml-2 underline rounded-full flex justify-center items-center text-base text-inputGray hover:text-button cursor-pointer '
              }
              onClick={() =>
                isAllSelected ? selectNoneProducts() : selectAllProducts()
              }
            >
              {isAllSelected ? t('select_none') : t('select_all')}
            </div>
          </label>
          <div className="flex flex-wrap">
            {listOfCategories.map((category: any) => {
              return (
                <div key={category.value}>
                  <div className="mb-4 lg:mb-6">
                    <SelectButton
                      checked={
                        categoriesProducts.filter(
                          (e: any) => e.category_name === category.value
                        ).length === 1
                      }
                      onClick={toggleEvent}
                      item={category.value}
                      smaller
                    />
                  </div>
                </div>
              );
            })}
          </div>
          {!roles.includes(UserRoles.LICENSOR) &&
            categoriesProducts &&
            categoriesProducts.map((product: any) => {
              return (
                <div className="mt-8" key={product.category_name}>
                  <Input
                    type="text"
                    register={register}
                    labelOld={t('onboarding.enter-products-for') + ' '}
                    labelOldEmphasis={product.category_name}
                    name={`${product.category_name}`}
                    placeholder={t('onboarding.enter-and-click-enter-to-add')}
                    required={true}
                    keydown={handleEnterPressed(product.category_name)}
                    smaller
                    showAddButton
                    addButtonOnClick={() =>
                      buttonEnterPressed(product.category_name)
                    }
                  />
                  {error && (
                    <div className="h-4 mb-6 ml-4 text-sm text-red-400 font-custom2">
                      {error}
                    </div>
                  )}
                  <div className="flex flex-wrap m-2">
                    {product &&
                      Array.isArray(product.products) &&
                      product.products.map((item: any) => {
                        return (
                          <div
                            className={
                              'flex mb-4 lg:mb-6 text-lg md:text-xl lg:text-2xl'
                            }
                            key={item.product_name}
                          >
                            <SelectButton
                              checked={true}
                              onClick={handleRemoveProduct}
                              item={item.product_name}
                              smaller={true}
                              differentOnClick={true}
                              productCategory={product.category_name}
                            />
                          </div>
                        );
                      })}
                  </div>
                </div>
              );
            })}
        </div>

        {storeProperty2 && categoriesProducts.length > 0 && (
          <div className="flex flex-col my-4">
            <label
              className={
                'mb-8 flex items-center text-lg font-bold font-custom1 md:text-xl lg:text-2xl'
              }
            >
              <div>
                <HeaderSplitPrimaryButton label="onboarding.core-product-categories" />
              </div>
            </label>
            <div className="flex flex-wrap">
              {categoriesProducts
                .map((value: any) => value.category_name)
                .map((category: any) => {
                  return (
                    <div key={category}>
                      <div className="mb-4 lg:mb-6">
                        <SelectButton
                          checked={
                            coreCategories
                              ? coreCategories.filter(
                                  (e: any) => e.category_name === category
                                ).length === 1
                              : false
                          }
                          onClick={toggleEventCore}
                          color="yellow"
                          item={category}
                          smaller
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        <Button onClick={() => onSubmit()}>{t('next-step')}</Button>
      </div>
      <div className="flex justify-center align-center m-28">
        <BackButton onClick={() => goBackAStep()} />
      </div>
    </>
  );
};

export default CategoryProductsWizard;
