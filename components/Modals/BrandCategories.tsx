import { useTranslation } from 'next-i18next';
import * as _ from 'lodash';
import React, { useState } from 'react';

import BubbleList from 'components/BubbleLists/BubbleList';
import Button from 'components/Buttons/Button';
import { ModalDismissAsyncButton } from 'components/ModalWindow';
import { listOfBrandCategories } from 'public/helpers/data';
import { patchItem } from 'api/item/patchItem';

interface Props {
  defaultValue: string[];
  refreshProperties: () => void;
  uuid: string;
}

const BrandCategories: React.FC<Props> = ({
  defaultValue,
  refreshProperties,
  uuid,
}) => {
  const { t } = useTranslation();
  const copy = _.cloneDeep(defaultValue);

  const [state, setState] = useState<{ selections: string[] }>({
    selections: copy || [],
  });
  const [error, setError] = useState<string>('');
  const [isDisabled, setIsDisabled] = useState<boolean>(false);

  const patch = () => {
    setIsDisabled(true);
    const user = {
      categories_brand: state.selections,
      uuid,
    };

    return patchItem(user)
      .then((res) => {
        refreshProperties();
        setIsDisabled(false);
        return res;
      })
      .catch((err) => {
        setIsDisabled(false);
        setError(JSON.parse(err.request.response).message);
      });
  };

  return (
    <>
      <BubbleList
        checkList={listOfBrandCategories}
        label="add-product.what-categories-best-represent-your-brand"
        bubbleName="categories_brand"
        state={state}
        setState={setState}
        defaultValue={[]}
        selectAll={true}
        smaller
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

export default BrandCategories;
