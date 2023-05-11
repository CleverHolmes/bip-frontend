import produce from 'immer';
import React, { useCallback } from 'react';
import { useTranslation } from 'next-i18next';
import { FieldValues, UseFormRegister } from 'react-hook-form';

import Input from 'components/Input';
import SelectButton from 'components/Buttons/SelectButton';
import { listOfCategories } from 'public/helpers/data';
import useStore from 'modules/Store';
import HeaderSplitPrimaryButton from 'components/HeaderSplitPrimaryButton';
import { UserRoles } from 'models/user/user';

type Props = {
  bubbleName: string;
  defaultValue: string[];
  children?: React.ReactNode;
  categoriesProducts: any;
  setCategoriesProducts: any;
  categoriesCore?: string[];
  setCategoriesCore?: any;
  register: UseFormRegister<FieldValues>;
  getValues: any;
  setValue: any;
  selectAll?: boolean;
  isLicensee?: boolean;
  productItem?: boolean;
  extraText?: string;
};

const CategoriesProducts: React.FC<Props> = ({
  categoriesProducts,
  categoriesCore,
  setCategoriesProducts,
  setCategoriesCore,
  getValues,
  register,
  setValue,
  isLicensee,
  selectAll,
  productItem,
  extraText,
}) => {
  const { t } = useTranslation();
  const roles = useStore((state) => state.roles);

  // const [error, setError] = useState<string>('');

  const addACategory = (categoryName: string) =>
    setCategoriesProducts((prevState: any) => [
      ...prevState,
      { category_name: categoryName, products: [] },
    ]);

  const addACoreCategory = (categoryName: string) =>
    setCategoriesCore((prevState: any) => [
      ...prevState,
      { category_name: categoryName, products: [] },
    ]);

  const handleAddProduct = useCallback(
    (categoryName: string, product: string) => {
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
    categoriesCore &&
      setCategoriesCore(
        categoriesCore.filter(
          (item: any) => item.category_name !== categoryName
        )
      );
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
      categoriesCore &&
      categoriesCore.filter(
        (item: any) => item.category_name.trim() === categoryName.trim()
      ).length > 0
    ) {
      removeACoreCategory(categoryName);
    } else {
      addACoreCategory(categoryName);
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
          // setError(t('onboarding.already-exists-can-only-enter-unique-values'));
          // alert(t('onboarding.product-already-exists'));
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
      // setError(
      //   `*${t('onboarding.already-exists-can-only-enter-unique-values')}`
      // );
      // alert(`${t('onboarding.product-already-exists')}`);
    } else {
      handleAddProduct(param, value);
      setValue(param, '');
    }
  };

  const isAllSelected = categoriesProducts.length === listOfCategories.length;

  return (
    <div className="flex flex-col">
      <label
        className={
          'mb-8 flex items-center text-lg font-bold font-custom1 md:text-xl lg:text-2xl'
        }
      >
        <div className="inline-block">
          <span className="text-primary">
            {t('onboarding.what-product-categories-do')}
          </span>
          <span className="ml-1 text-button">
            {t('onboarding.you-want-to-work-with')}?
          </span>
        </div>
        <span className="ml-2 text-base font-normal text-inputGray lg:text-lg">
          {extraText && `(${extraText})`}
        </span>
        {selectAll && (
          <div
            className={
              'text-center font-normal ml-2 underline rounded-full flex justify-center items-center text-base text-inputGray hover:text-button cursor-pointer md:mt-1 '
            }
            onClick={() =>
              isAllSelected ? selectNoneProducts() : selectAllProducts()
            }
          >
            {isAllSelected ? t('select_none') : t('select_all')}
          </div>
        )}
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
      {categoriesProducts &&
        (!roles.includes(UserRoles.LICENSOR) || productItem) &&
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
              {/* {error && (
                <div className="h-4 mb-6 ml-4 text-sm text-red-400 font-custom2">
                  {error}
                </div>
              )} */}
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
      {categoriesCore && isLicensee && categoriesProducts.length > 0 && (
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
                          categoriesCore.filter(
                            (e: any) => e.category_name === category
                          ).length === 1
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
    </div>
  );
};

export default CategoriesProducts;
