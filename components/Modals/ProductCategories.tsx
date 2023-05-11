import produce from 'immer';
import { useTranslation } from 'next-i18next';
import * as _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import Button from 'components/Buttons/Button';
import CategoriesProducts from 'components/CategoriesProducts';
import { ModalDismissAsyncButton } from 'components/ModalWindow';
import useStore from 'modules/Store';
import { patchUser } from 'api/user/patchUser';
import { CategoriesItem } from 'models/item/item';
import useTokensOrCookies from 'contexts/TokensOrCookies';
import { UserRoles } from 'models/user/user';

interface Props {
  defaultValue: CategoriesItem[];
  defaultValueCore?: CategoriesItem[];
  refreshUser?: () => void;
  profile?: boolean;
  productItem?: boolean;
  isLicensee?: boolean;
}

const ProductCategories: React.FC<Props> = ({
  defaultValue,
  defaultValueCore,
  refreshUser,
  profile,
  productItem,
  isLicensee,
}) => {
  const userUUID = useStore((state) => state.userUUID);
  const roles = useStore((state) => state.roles);
  const { t } = useTranslation();
  const { companyRepresented } = useTokensOrCookies();

  const copy = _.cloneDeep(defaultValue);
  const copyCore = _.cloneDeep(defaultValueCore);

  const [error, setError] = useState<string>('');
  const [callPatch, setCallPatch] = useState<boolean>(false);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);

  const { register, getValues, setValue } = useForm();

  const [categoriesProducts, setCategoriesProducts] = useState<any>(copy || []);
  const [categoriesCore, setCategoriesCore] = useState<any>(copyCore || []);
  let mainCategories =
    categoriesProducts &&
    categoriesProducts.filter((category: any) => category.products.length > 0);

  const handleAddProduct = (categoryName: string, product: string) => {
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
  };

  const patch = () => {
    // SBP- come back to this is pretty janky, modal will always close even if there is an error
    setCallPatch(false);
    !roles.includes(UserRoles.LICENSOR) &&
      categoriesProducts.map((category: any) => {
        const value = getValues(category.category_name);
        if (
          value?.length > 0 &&
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

  type UserPatch = {
    user_uuid: string;
    categories_licensee?: any;
    categories_licensee_core?: CategoriesItem[];
    categories?: any;
  };

  useEffect(() => {
    if (callPatch === true) {
      if (profile === true) {
        setIsDisabled(true);

        const user: UserPatch = {
          user_uuid: companyRepresented ? companyRepresented : userUUID,
        };

        if (isLicensee) {
          user.categories_licensee = categoriesProducts;
          user.categories_licensee_core = categoriesCore;
        } else {
          user.categories = categoriesProducts;
        }

        patchUser(user)
          .then((res) => {
            if (refreshUser) {
              refreshUser();
            }
            setIsDisabled(false);
            setCallPatch(false);
          })
          .catch((err) => {
            setIsDisabled(false);
            setError(JSON.parse(err.request.response).message);
            setCallPatch(false);
          });
      } else {
        if (isLicensee) {
          useStore.setState({ categories_licensee: categoriesProducts });
          useStore.setState({ categories_licensee_core: categoriesCore });
        } else {
          useStore.setState({ categories: categoriesProducts });
        }
        setCallPatch(false);
      }
    }
  }, [
    callPatch,
    categoriesProducts,
    companyRepresented,
    userUUID,
    profile,
    refreshUser,
  ]);

  return (
    <>
      <CategoriesProducts
        categoriesProducts={categoriesProducts}
        categoriesCore={categoriesCore}
        setCategoriesProducts={setCategoriesProducts}
        setCategoriesCore={setCategoriesCore}
        bubbleName="property_categories"
        defaultValue={[]}
        register={register}
        getValues={getValues}
        setValue={setValue}
        productItem={productItem}
        isLicensee={isLicensee}
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

export default ProductCategories;
