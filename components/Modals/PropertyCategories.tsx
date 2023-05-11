import { useTranslation } from 'next-i18next';
import produce from 'immer';
import * as _ from 'lodash';
import React, { useState, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';

import Button from 'components/Buttons/Button';
import CategoriesProducts from 'components/CategoriesProducts';
import { ModalDismissAsyncButton } from 'components/ModalWindow';
import { patchItem } from 'api/item/patchItem';
import { CategoriesItem } from 'models/item/item';

interface Props {
  defaultValue: CategoriesItem[];
  defaultValueToggle: string[];
  refreshProperties: () => void;
  uuid: string;
}

// This is used for modal on the settings page for products
const PropertyCategories: React.FC<Props> = ({
  defaultValue,
  refreshProperties,
  uuid,
  defaultValueToggle,
}) => {
  const { t } = useTranslation();
  const copy = _.cloneDeep(defaultValue);
  const [error, setError] = useState<string>('');
  const [callPatch, setCallPatch] = useState<boolean>(false);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);

  const { register, getValues, setValue } = useForm();

  const [categoriesProducts, setCategoriesProducts] = useState<
    CategoriesItem[]
  >(copy || []);

  const copyNonNeg = _.cloneDeep(defaultValueToggle);
  const [nonNegotionableTerms, setNonNegotionableTerms] =
    useState<string[]>(copyNonNeg);

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

  useEffect(() => {
    if (callPatch === true) {
      const mainCategories =
        categoriesProducts &&
        categoriesProducts.filter(
          (category: any) => category.products.length > 0
        );

      const user = {
        categories: categoriesProducts,
        uuid,
        non_negotiable_terms:
          mainCategories.length > 1
            ? nonNegotionableTerms.filter(
                (item) =>
                  item !== 'royalty_percent' && item !== 'minimum_guarantee'
              )
            : nonNegotionableTerms,
      };

      patchItem(user)
        .then((res) => {
          refreshProperties();
          setIsDisabled(false);
          // return res;
        })
        .catch((err) => {
          setIsDisabled(false);
          setError(JSON.parse(err.request.response).message);
        });
    }
  }, [
    callPatch,
    categoriesProducts,
    nonNegotionableTerms,
    refreshProperties,
    uuid,
  ]);

  const patch = () => {
    // SBP- come back to this is pretty janky, modal will always close even if there is an error
    setCallPatch(false);
    categoriesProducts.map((category: any) => {
      const value = getValues(category.category_name);
      if (
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
    setCallPatch(true);
    return new Promise((resolve, reject) => {
      resolve(201);
    });
  };

  return (
    <>
      <CategoriesProducts
        categoriesProducts={categoriesProducts}
        setCategoriesProducts={setCategoriesProducts}
        bubbleName="property_categories"
        defaultValue={[]}
        register={register}
        getValues={getValues}
        setValue={setValue}
        productItem={true}
      />
      <div className="h-4 mt-2 ml-4 text-sm text-red-400 font-custom2">
        {error && error}
      </div>
      <div className="flex items-center justify-center my-10">
        <ModalDismissAsyncButton>
          <Button disabled={isDisabled} onClick={patch}>
            {t('submit')}
          </Button>
        </ModalDismissAsyncButton>
      </div>
    </>
  );
};

export default PropertyCategories;
