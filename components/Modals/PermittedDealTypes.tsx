import { useTranslation } from 'next-i18next';
import * as _ from 'lodash';
import React, { useState } from 'react';

import Button from 'components/Buttons/Button';
import CheckBoxes from 'components/CheckBoxes';
import { ModalDismissAsyncButton } from 'components/ModalWindow';
import { typeOfDeal } from 'public/helpers/data';
import { patchItem } from 'api/item/patchItem';
import { DealTypeEnum } from 'models/item/item';

interface Props {
  defaultValue: any;
  refreshProperties: () => void;
  uuid: string;
}

const PermittedDealTypes: React.FC<Props> = ({
  defaultValue,
  refreshProperties,
  uuid,
}) => {
  const { t } = useTranslation();

  const copy = _.cloneDeep(defaultValue);
  const [error, setError] = useState('');
  const [isDisabled, setIsDisabled] = useState<boolean>(false);

  const [stateCheckBox, setStateCheckBox] = useState<{
    selections: Array<keyof typeof DealTypeEnum>;
  }>({
    selections: copy,
  });

  function handleCheckboxChange(key: keyof typeof DealTypeEnum) {
    let sel = stateCheckBox.selections;
    let find = sel.indexOf(key);
    if (find > -1) {
      sel.splice(find, 1);
    } else {
      sel.push(key);
    }

    setStateCheckBox({
      selections: sel,
    });
  }

  const patch = () => {
    setIsDisabled(true);
    const item = {
      permitted_deal_types: stateCheckBox.selections,
      uuid,
    };

    return patchItem(item)
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
      <CheckBoxes
        selections={stateCheckBox.selections}
        checkList={typeOfDeal}
        onChange={handleCheckboxChange}
        label="onboarding.listed-for-a-licensing-deal-in-the-normal-explore-page-or-on-the-collaborations-explore-page"
        smaller={true}
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

export default PermittedDealTypes;
