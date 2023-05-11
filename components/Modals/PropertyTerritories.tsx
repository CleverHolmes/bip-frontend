import { useTranslation } from 'next-i18next';
import * as _ from 'lodash';
import React, { useState } from 'react';

import BubbleList from 'components/BubbleLists/BubbleList';
import Button from 'components/Buttons/Button';
import { ModalDismissAsyncButton } from 'components/ModalWindow';
import NonNegotiableToggle from 'components/NonNegotiableToggle';
import { listOfTerritories, typesOfTerritories } from 'public/helpers/data';
import { patchItem } from 'api/item/patchItem';

interface Props {
  defaultValue: string[];
  defaultValueToggle: string[];
  refreshProperties: () => void;
  uuid: string;
}

const PropertyTerritories: React.FC<Props> = ({
  defaultValue,
  refreshProperties,
  uuid,
  defaultValueToggle,
}) => {
  const { t } = useTranslation();
  const copy = _.cloneDeep(defaultValue);

  const [state, setState] = useState<{ selections: string[] }>({
    selections: copy || [],
  });
  const [error, setError] = useState<string>('');
  const [isDisabled, setIsDisabled] = useState<boolean>(false);

  const copyNonNeg = _.cloneDeep(defaultValueToggle);
  const [nonNegotionableTerms, setNonNegotionableTerms] =
    useState<string[]>(copyNonNeg);

  const handleToggle = (item: string) => {
    if (nonNegotionableTerms.includes(item)) {
      setNonNegotionableTerms(nonNegotionableTerms.filter((i) => item !== i));
    } else {
      setNonNegotionableTerms([...nonNegotionableTerms, item]);
    }
  };

  const patch = () => {
    setIsDisabled(true);
    const user = {
      territories: state.selections,
      uuid,
      non_negotiable_terms: nonNegotionableTerms,
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
        checkList={listOfTerritories}
        types={typesOfTerritories}
        label="onboarding.what-territories-do-you-operate-in"
        bubbleName="territories"
        state={state}
        setState={setState}
        defaultValue={[]}
        smaller
      />
      <NonNegotiableToggle
        onChange={() => handleToggle('territories')}
        toggleValue="territories"
        toggleID="territories"
        checked={nonNegotionableTerms.includes('territories')}
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

export default PropertyTerritories;
